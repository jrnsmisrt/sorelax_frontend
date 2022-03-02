import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Booking} from "../../model/Booking";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import firebase from "firebase/compat/app";
import {User} from "../../model/User";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-admin-booking-overview',
  templateUrl: './admin-booking-overview.component.html',
  styleUrls: ['./admin-booking-overview.component.css']
})
export class AdminBookingOverviewComponent implements OnInit {
  bookings$!: Observable<Booking[]>;
  selectedBooking!: Booking | undefined;
  users$!: Observable<User[]>;
  selectedUser!: User | undefined;

  constructor(private fireStore: AngularFirestore, private userService: UserService) {
    this.bookings$ = this.fireStore.collection<Booking>('bookings', ref => ref.orderBy('date', 'asc').orderBy('time', 'asc')).valueChanges();
    this.users$ = this.fireStore.collection<User>('users').valueChanges();
  }

  ngOnInit(): void {
    $(document).ready(function () {
      $('.modal').modal();
      console.log('init modal')
    });
  }


  openViewBookingModal(bookingId: string, userId: string) {
    this.fireStore.collection<Booking>('bookings').doc(bookingId).valueChanges().subscribe((booking) => {
      return this.selectedBooking = booking;
    });
    this.fireStore.collection<User>('users').doc(userId).valueChanges().subscribe((user) => {
      console.log(user?.firstName);
      return this.selectedUser = user;
    });
    M.Modal.getInstance(document.getElementById('viewBookingModal')!).open();
  }

  confirmBooking(bookingId: string) {
    this.fireStore.collection<Booking>('bookings').doc(bookingId).update({
      status: 'confirmed'
    }).then(() => {
      M.toast({html: 'Booking confirmed'});
    }).catch(error => {
      console.log(error);
    })
  }

  cancelBooking(bookingId: string) {
    this.fireStore.collection<Booking>('bookings').doc(bookingId).update({
      status: 'cancelled'
    }).then(() => {
      M.toast({html: 'Booking cancelled'});
    }).catch(error => {
      console.log(error);
    })
  }

  deleteBooking(bookingId:string){
    this.fireStore.collection<Booking>('bookings').doc(bookingId).update({
      status: 'DELETED'
    }).then(()=>{
      M.toast({html:'Booking deleted'});
    }).catch(error=>{
      console.log(error);
    })
  }
}
