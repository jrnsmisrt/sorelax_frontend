import {Component, OnInit} from '@angular/core';
import {Booking} from "../../model/Booking";
import {Observable} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {User} from "../../model/User";
import firebase from "firebase/compat/app";

@Component({
  selector: 'app-booking-overview',
  templateUrl: './booking-overview.component.html',
  styleUrls: ['./booking-overview.component.css']
})
export class BookingOverviewComponent implements OnInit {
  bookingCollection!: AngularFirestoreCollection<Booking>;
  bookings$!: Observable<Booking[]>;
  booking$!: Observable<Booking | undefined>;

  changeBookingStatusId: string | undefined;
  changeBookingStatus: string | undefined;

  bookingUserFullName!: string;
  users$!: Observable<User[]>;

  user$!: Observable<User | undefined>;

  constructor(private fireStore: AngularFirestore, private auth: AuthService, private userService: UserService) {
    this.bookingCollection = this.fireStore.collection('bookings');
    this.bookings$ = this.getAllBookings();
    this.users$ = this.userService.allUsers;
    this.user$ = this.fireStore.collection<User>('users').doc(`${firebase.auth().currentUser?.uid}`).valueChanges();
  }

  ngOnInit(): void {
    $(document).ready(function () {
      $('.modal').modal();
    });
  }


  getAllBookings(): Observable<Booking[]> {
    return this.fireStore.collection<Booking>('bookings', ref => ref.where('userUid', '==', firebase.auth().currentUser?.uid)
      .orderBy('date', 'asc').orderBy('time', 'asc').orderBy('requestedOn', 'asc')).valueChanges();
  }

  setBooking(bookingId: string) {
    this.booking$ = this.fireStore.doc<Booking>(`bookings/${bookingId}`).valueChanges();
  }


  setUserName(userId: string|undefined) {
    this.userService.getUser(userId).subscribe((user) => {
      this.bookingUserFullName = user?.firstName + ' ' + user?.lastName!;
    });
  }

  confirmBooking(bookingId: string) {
    let booking = this.fireStore.doc<Booking>(`bookings/${bookingId}`).valueChanges();
    booking.subscribe((b) => {
      if (b?.status !== 'confirmed') {
        this.fireStore.doc<Booking>(`bookings/${bookingId}`).update({
          status: 'confirmed'
        }).catch(error => {
          console.log('confirm booking: ' + error);
        })
      }
    })
  }

  cancelBooking(bookingId: string) {
    this.fireStore.doc<Booking>(`bookings/${bookingId}`).update({
      status: 'cancelled',
    }).catch(error => {
      console.log('cancel booking: ' + error);
    });
  }

  openModal(bookingId: string|undefined, customerId: string|undefined) {
    console.log(bookingId);
    this.booking$ = this.fireStore.collection<Booking>('bookings').doc(`${bookingId}`).valueChanges();
    this.setUserName(customerId);
    M.Modal.getInstance(document.getElementById('cancelModal')!).open();
  }
}
