import {Component, OnDestroy, OnInit} from '@angular/core';
import {Booking} from "../model/Booking";
import {Observable, Subject, takeUntil} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {User} from "../model/User";
import firebase from "firebase/compat/app";
import {InitService} from "../materialize/init.service";

@Component({
  selector: 'app-booking-overview',
  templateUrl: './booking-overview.component.html',
})
export class BookingOverviewComponent implements OnInit, OnDestroy {
  bookingCollection!: AngularFirestoreCollection<Booking>;
  bookings$!: Observable<Booking[]>;
  cancelBookingId!: string;

  users$!: Observable<User[]>;
  user$!: Observable<User | undefined>;

  searchDate!: string;
  searchStatus!: string;
  searchMassage!: string;
  private destroy$ = new Subject();

  constructor(private fireStore: AngularFirestore, private auth: AuthService, private userService: UserService, private init: InitService) {
    this.bookingCollection = this.fireStore.collection('bookings');
    this.bookings$ = this.getAllBookings();
    this.users$ = this.userService.allUsers;
    this.user$ = this.fireStore.collection<User>('users').doc(`${firebase.auth().currentUser?.uid}`)
      .valueChanges().pipe(takeUntil(this.destroy$));
  }

  ngOnInit(): void {
    this.init.initCollapsible();
    this.init.initSelect();
    this.init.initModal();
  }

  getAllBookings(): Observable<Booking[]> {
    return this.fireStore.collection<Booking>('bookings', ref =>
      ref.where('userUid', '==', firebase.auth().currentUser?.uid)
        .orderBy('date', 'asc').orderBy('time', 'asc')
        .orderBy('requestedOn', 'asc'))
      .valueChanges().pipe(takeUntil(this.destroy$));
  }

  cancelBooking(bookingId: string) {
    this.fireStore.doc<Booking>(`bookings/${bookingId}`).update({
      status: 'cancelled',
    }).then(async () => {
      M.toast({html: 'Boeking werd geannuleerd', classes: 'rounded teal'});

      let booking = this.fireStore.collection<Booking>('bookings').doc(bookingId)
        .valueChanges().pipe(takeUntil(this.destroy$));
      booking.subscribe((booking) => {

        let usr = this.fireStore.collection<User>('users').doc(booking?.userUid)
          .valueChanges().pipe(takeUntil(this.destroy$));

        usr.subscribe((usr) => {
          this.fireStore.collection('mail').add({
            to: 'sverkouille@hotmail.com',
            from: firebase.auth().currentUser?.email,
            message: {
              subject: `Sorelax: Annulatie Boeking ${booking?.date} ${usr?.lastName}`,
              html: `<code>Beste,<br>
                Volgende boeking werd zonet geannuleerd:<br>
                Van: ${usr?.firstName} ${usr?.lastName} <br>
                <strong>${booking!.massage}</strong> massage op ${booking!.date} om ${booking?.preferredTime} voor ${booking?.duration} minuten<br>
                <br><br>

                Mvg,
                Sorelax
                </code>`,
            },
          }).catch((error) => {
            M.toast({html: `${error}`, classes: 'rounded red'});
          });
        });
      })
    }).catch(error => {
      M.toast({html: `${error}`, classes: 'rounded red'});
      console.log('cancel booking: ' + error);
    });
  }

  openConfirmCancelBooking(id: string) {
    this.cancelBookingId = id;
    M.Modal.getInstance(document.getElementById('confirmCancelBooking')!).open();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
