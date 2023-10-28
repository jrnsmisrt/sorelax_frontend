import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, mergeMap, Observable, Subject, takeUntil} from "rxjs";
import {Booking} from "../model/Booking";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {User} from "../model/User";
import {InitService} from "../materialize/init.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-admin-booking-overview',
  templateUrl: './admin-booking-overview.component.html',
})
export class AdminBookingOverviewComponent implements OnInit, OnDestroy {
  bookings$!: Observable<Booking[]>;
  selectedBooking!: Booking | undefined;
  users$!: Observable<User[]>;
  selectedUser!: User | undefined;
  searchName!: string;
  searchDate!: string;
  searchStatus: string = 'pending';
  searchMassage!: string;

  bookingStatusChangeForm!: FormGroup;
  message!: string;
  private destroy$ = new Subject();

  constructor(private fireStore: AngularFirestore,
              public auth: AuthService,
              private init: InitService,
              private formBuilder: FormBuilder) {
    this.bookings$ = this.fireStore.collection<Booking>('bookings', ref => ref.orderBy('date', 'asc')
      .orderBy('time', 'asc')).valueChanges().pipe(takeUntil(this.destroy$));
    this.users$ = this.fireStore.collection<User>('users').valueChanges().pipe(takeUntil(this.destroy$));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.init.initModal();
    this.init.initDatePicker();
    this.init.initSelect();
    this.init.initCollapsible();
    this.bookingStatusChangeForm = this.formBuilder.group({
      message: ['']
    });
  }


  openViewBookingModal(bookingId: string, userId: string) {
    this.message = '';
    const booking$ = this.fireStore.collection<Booking>('bookings').doc(bookingId).valueChanges();
    const user$ = this.fireStore.collection<User>('users')
      .valueChanges()
      .pipe(mergeMap(u => {
        return u.filter(usr => usr.id === userId);
      }));

    combineLatest([booking$, user$]).pipe(takeUntil(this.destroy$))
      .subscribe(([booking, user]) => {
        this.selectedBooking = booking;
        this.selectedUser = user;
      })

    M.Modal.getInstance(document.getElementById('viewBookingModal')!).open();
  }

  confirmBooking(bookingId: string, userId: string) {
    let booking = this.fireStore.collection<Booking>('bookings').doc(bookingId).valueChanges().pipe(takeUntil(this.destroy$));
    let user = this.fireStore.collection<User>('users').valueChanges()
      .pipe(takeUntil(this.destroy$), mergeMap(u => {
        return u.filter(usr => usr.id === userId);
      }));
    const complete = new Subject();

    combineLatest([booking, user]).pipe(takeUntil(complete)).subscribe(([b, u]) => {
      this.fireStore.collection<Booking>('bookings').doc(b!.id).update({
        status: 'confirmed'
      }).finally(() => {
        M.toast({html: 'boeking bevestigd', classes: 'rounded teal'});
        complete.next(true);
        complete.complete();
      }).catch((err) => {
        M.toast({html: `${err}`})
      });

      let year = b?.date.slice(6);
      let month = b?.date.slice(3, 5);
      let day = b?.date.slice(0, 2);
      let hour = b?.preferredTime.slice(0, 3);
      let minutes = b?.preferredTime.slice(4);

      function calculateMinutes(hours: number, minutes: number): number {
        return (hours * 60) + minutes;
      }

      let startHourInMinutes = calculateMinutes(Number(hour), Number(minutes));
      let startDateTime = new Date(Number(year), Number(month) - 1, Number(day));
      let newStartDateTime = new Date(startDateTime.setMinutes(startDateTime.getMinutes() + startHourInMinutes));
      let endDateTime = new Date(startDateTime.setMinutes(startDateTime.getMinutes() + Number(b!.duration)));
      let description = `${b!.massage} massage van ${b!.duration} minuten; \n ${b!.personalMessage}`;
      let summary = `${b!.massage} massage : ${u!.firstName} ${u!.lastName}`;

      this.auth.insertEvent(
        newStartDateTime,
        endDateTime,
        description,
        summary
      );

      this.fireStore.collection('mail').add({
        to: u!.email,
        from: 'info@sorelax.be',
        message: {
          subject: 'Bevestiging Boeking',
          html: `<code>Beste,<br><br>
                    Uw boeking werd bevestigd!<br>
                    <strong>${b!.massage}</strong> massage op ${b!.date} om ${b?.preferredTime} voor ${b?.duration} minuten.<br>
                    <br>
                    Boodschap:
                    <br>
                    ${this.message}<br><br>

                    Mvg,<br>
                    Sofie
                    </code>`,
        },
      }).catch((error) => {
        M.toast({html: `${error}`, classes: 'rounded red'});
      });
    });

    M.Modal.getInstance(document.getElementById('viewBookingModal')!).close();
  }

  cancelBooking(bookingId: string, userId: string) {
    let booking = this.fireStore.collection<Booking>('bookings').doc(bookingId).valueChanges();
    let user = this.fireStore.collection<User>('users').valueChanges()
      .pipe(mergeMap(u => {
        return u.filter(usr => usr.id === userId);
      }));
    const complete = new Subject();

    combineLatest([booking, user]).pipe(takeUntil(complete)).subscribe(([b, u]) => {
      this.fireStore.collection<Booking>('bookings').doc(b!.id).update({
        status: 'cancelled',
      }).finally(() => {
        M.toast({html: 'boeking geannuleerd', classes: 'rounded teal'});
        complete.next(true);
        complete.complete();
      }).catch((err) => {
        M.toast({html: `${err}`})
      });

      this.fireStore.collection('mail').add({
        to: u?.email,
        from: 'info@sorelax.be',
        message: {
          subject: 'Annulatie Boeking',
          html: `<code>Beste,<br><br>
                    Uw boeking werd helaas geannuleerd!<br>
                    <strong>${b!.massage}</strong> massage op ${b!.date} om ${b!.preferredTime} voor ${b!.duration} minuten<br>
                    Deze boeking kan helaas niet doorgaan.
                    <br>
                    Boodschap:<br>
                    ${this.message}<br><br>

                    Mvg,<br>
                    Sofie
                    </code>`,
        }
      }).catch((error) => {
        M.toast({html: `${error}`, classes: 'rounded red'});
      });
    });
    M.Modal.getInstance(document.getElementById('viewBookingModal')!).close();
  }

  deleteBooking(bookingId: string) {
    this.fireStore.collection<Booking>('bookings').doc(bookingId).update({
      status: 'DELETED'
    }).finally(() => {
      M.toast({html: 'Booking deleted', classes: 'rounded teal'});
    }).catch(error => {
      M.toast({html: `${error}`, classes: 'rounded red'});
    })

    M.Modal.getInstance(document.getElementById('viewBookingModal')!).close();
  }

  setDate(searchDate: string) {
    this.searchDate = searchDate;
  }
}
