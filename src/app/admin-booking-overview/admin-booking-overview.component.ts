import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
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
export class AdminBookingOverviewComponent implements OnInit {
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

  constructor(private fireStore: AngularFirestore,
              public auth: AuthService,
              private init: InitService,
              private formBuilder: FormBuilder) {
    this.bookings$ = this.fireStore.collection<Booking>('bookings', ref => ref.orderBy('date', 'asc').orderBy('time', 'asc')).valueChanges();
    this.users$ = this.fireStore.collection<User>('users').valueChanges();
  }

  ngOnInit(): void {
//    this.auth.loginWithGoogle();
    //  this.auth.getCalendar();
    this.init.initModal();
    this.init.initDatePicker();
    this.init.initSelect();
    this.init.initCollapsible();

    $(document).ready(function () {
      $('.collapsible2').collapsible();
    });
    this.bookingStatusChangeForm = this.formBuilder.group({
      message: ['']
    });
  }


  openViewBookingModal(bookingId: string, userId: string) {
    this.message = '';
    this.fireStore.collection<Booking>('bookings').doc(bookingId).valueChanges().subscribe((booking) => {
      return this.selectedBooking = booking;
    });
    this.fireStore.collection<User>('users').doc(userId).valueChanges().subscribe((user) => {
      console.log(user?.firstName);
      return this.selectedUser = user;
    });
    M.Modal.getInstance(document.getElementById('viewBookingModal')!).open();
  }

  async confirmBooking(bookingId: string, userId: string) {

    await this.fireStore.collection<User>('users').doc(userId).valueChanges().subscribe((u) => {

      this.fireStore.collection<Booking>('bookings').doc(bookingId).update({
        status: 'confirmed'
      }).then(async () => {
        M.toast({html: 'Booking confirmed', classes: 'rounded teal'});
        let booking = this.fireStore.collection<Booking>('bookings').doc(bookingId).valueChanges();


        await booking.subscribe(async (booking) => {


          let year = booking?.date.slice(6);
          let month = booking?.date.slice(3, 5);
          let day = booking?.date.slice(0, 2)

          let hour = booking?.preferredTime.slice(0,3);
          let minutes = booking?.preferredTime.slice(4);

          function calculateMinutes(hours: number, minutes: number): number{
            return (hours*60)+minutes;
          }

          let startHourInMinutes= calculateMinutes(Number(hour), Number(minutes));

          console.log(year, month, day);

          let startDateTime = new Date(Number(year), Number(month), Number(day));
          startDateTime = new Date(startDateTime.setMinutes(startDateTime.getMinutes()+startHourInMinutes));
          console.log('startdate', startDateTime);

          let endDateTime = new Date(startDateTime.setMinutes(startDateTime.getMinutes() + Number(booking?.duration)));
          console.log('endate', endDateTime);
          let description = `${booking?.massage} massage van ${booking?.duration} minuten; \n ${booking?.personalMessage}`;
          console.log('description', description)
          let summary = `${booking?.massage} massage : ${u?.firstName} ${u?.lastName}`;
          console.log('summary', summary);
          console.log('insertevent');
          await this.auth.insertEvent(
            startDateTime,
            endDateTime,
            description,
            summary
          );
          console.log('end insertevent');

          await this.fireStore.collection('mail').add({
            to: u?.email,
            from: 'info@sorelax.be',
            message: {
              subject: 'Bevestiging Boeking',
              html: `<code>Beste,<br><br>
                Uw boeking werd bevestigd!<br>
                <strong>${booking!.massage}</strong> massage op ${booking!.date} om ${booking?.preferredTime} voor ${booking?.duration} minuten.<br>
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
          })
        })
      }).catch(error => {
        M.toast({html: `${error}`, classes: 'rounded red'});
        console.log(error);
      })
    });
    M.Modal.getInstance(document.getElementById('viewBookingModal')!).close();
  }

  async cancelBooking(bookingId: string, userId: string) {
    await this.fireStore.collection<User>('users').doc(userId).valueChanges().subscribe((u) => {
      this.fireStore.collection<Booking>('bookings').doc(bookingId).update({
        status: 'cancelled'
      }).then(async () => {
        M.toast({html: 'Booking cancelled', classes: 'rounded teal'});
        let booking = this.fireStore.collection<Booking>('bookings').doc(bookingId).valueChanges();
        await booking.subscribe((booking) => {

          this.fireStore.collection('mail').add({
            to: u?.email,
            from: 'info@sorelax.be',
            message: {
              subject: 'Annulatie Boeking',
              html: `<code>Beste,<br><br>
                Uw boeking werd helaas geannuleerd!<br>
                <strong>${booking!.massage}</strong> massage op ${booking!.date} om ${booking?.preferredTime} voor ${booking?.duration} minuten<br>
                Deze boeking kan helaas niet doorgaan.
                <br>
                Boodschap:<br>
                ${this.message}<br><br>

                Mvg,<br>
                Sofie
                </code>`,
            },
          }).catch((error) => {
            M.toast({html: `${error}`, classes: 'rounded red'});
          })
        })
      }).catch(error => {
        M.toast({html: `${error}`, classes: 'rounded red'});
        console.log(error);
      })
    });

    M.Modal.getInstance(document.getElementById('viewBookingModal')!).close();
  }

  deleteBooking(bookingId: string) {
    this.fireStore.collection<Booking>('bookings').doc(bookingId).update({
      status: 'DELETED'
    }).then(() => {
      M.toast({html: 'Booking deleted', classes: 'rounded teal'});
    }).catch(error => {
      M.toast({html: `${error}`, classes: 'rounded red'});
      console.log(error);
    })

    M.Modal.getInstance(document.getElementById('viewBookingModal')!).close();
  }

  setDate(searchDate: string) {
    this.searchDate = searchDate;

    console.log(this.searchDate);
  }

  getBookingUser(id: string | undefined): Observable<User | undefined> {
    return this.fireStore.collection<User>('users').doc(id).valueChanges();
  }

  getUsersBookings(id: string | undefined): Observable<Booking[] | undefined> {
    return this.fireStore.collection<Booking>('bookings', ref => ref.where('userUid', '==', id)).valueChanges();
  }

  messageChange(message: string) {
    this.message = message;
    console.log(this.message, message);
  }
}
