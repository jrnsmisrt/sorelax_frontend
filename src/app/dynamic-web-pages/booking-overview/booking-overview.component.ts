import {Component, OnInit} from '@angular/core';
import {Booking} from "../../model/Booking";
import {Observable, Subscription} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {User} from "../../model/User";
import firebase from "firebase/compat/app";
import {InitService} from "../../materialize/init.service";
import {TimeSlot} from "../../model/TimeSlot";

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

  cancelBookingId!: string;

  bookingUserFullName!: string;
  users$!: Observable<User[]>;

  user$!: Observable<User | undefined>;
  searchDate!: string;
  searchStatus!: string;


  constructor(private fireStore: AngularFirestore, private auth: AuthService, private userService: UserService, private init: InitService) {
    this.bookingCollection = this.fireStore.collection('bookings');
    this.bookings$ = this.getAllBookings();
    this.users$ = this.userService.allUsers;
    this.user$ = this.fireStore.collection<User>('users').doc(`${firebase.auth().currentUser?.uid}`).valueChanges();
  }

  ngOnInit(): void {
    $(document).ready(function () {
      $('.modal').modal();
    });

    $(document).ready(function(){
      $('select').formSelect();
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

  getUserName(id:string){
    this.fireStore.collection<User>('users').doc(id).valueChanges().subscribe((user) => {
      console.log(user?.firstName);
      this.bookingUserFullName += user?.firstName + ' ' + user?.lastName
    })
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
    }).then(()=>{
      M.toast({html:'Boeking werd geannuleerd', classes: 'rounded custom-toast'});
    }).then((b)=>{
      this.fireStore.doc<Booking>(`bookings/${bookingId}`).valueChanges().subscribe((b)=>{
        this.fireStore.doc<TimeSlot>(`timeslots/${b?.timeslot}`).update({
          isAvailable: true
        })
      });
    }).catch(error => {
      console.log('cancel booking: ' + error);
    });
  }

  //create method to return timeslot with booking id...

  openConfirmCancelBooking(id: string) {
    this.cancelBookingId = id;
    M.Modal.getInstance(document.getElementById('confirmCancelBooking')!).open();
  }

  openModal(bookingId: string|undefined, customerId: string|undefined) {
    this.booking$ = this.fireStore.collection<Booking>('bookings').doc(`${bookingId}`).valueChanges();
    this.setUserName(customerId);
    M.Modal.getInstance(document.getElementById('cancelModal')!).open();
  }


}
