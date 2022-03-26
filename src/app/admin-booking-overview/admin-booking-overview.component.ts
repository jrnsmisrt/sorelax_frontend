import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Booking} from "../model/Booking";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {User} from "../model/User";
import {InitService} from "../materialize/init.service";

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

  constructor(private fireStore: AngularFirestore, private init: InitService) {
    this.bookings$ = this.fireStore.collection<Booking>('bookings', ref => ref.orderBy('date', 'asc').orderBy('time', 'asc')).valueChanges();
    this.users$ = this.fireStore.collection<User>('users').valueChanges();
  }

  ngOnInit(): void {
    this.init.initModal();
    this.init.initDatePicker();
    this.init.initSelect();
    this.init.initCollapsible();
    $(document).ready(function () {
      $('.collapsible2').collapsible();
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
      //send E-mail
      M.toast({html: 'Booking confirmed', classes: 'rounded teal'});
    }).catch(error => {
      M.toast({html: `${error}`, classes: 'rounded red'});
      console.log(error);
    })
  }

  cancelBooking(bookingId: string) {
    this.fireStore.collection<Booking>('bookings').doc(bookingId).update({
      status: 'cancelled'
    }).then(() => {
      //send E-mail
      M.toast({html: 'Booking cancelled', classes: 'rounded teal'});
    }).catch(error => {
      M.toast({html: `${error}`, classes: 'rounded red'});
      console.log(error);
    })
  }

  deleteBooking(bookingId: string) {
    this.fireStore.collection<Booking>('bookings').doc(bookingId).update({
      status: 'DELETED'
    }).then(() => {
      //send E-mail
      M.toast({html: 'Booking deleted', classes: 'rounded teal'});
    }).catch(error => {
      M.toast({html: `${error}`, classes: 'rounded red'});
      console.log(error);
    })
  }

  setDate(searchDate: string) {
    /* let dp = M.Datepicker.getInstance(document.getElementById('filter_datum')!);
     dp.setInputValue();
     this.searchDate = dp.date.toLocaleString();*/
    this.searchDate = searchDate;

    console.log(this.searchDate);
  }

  getBookingUser(id: string|undefined): Observable<User|undefined>{
    return this.fireStore.collection<User>('users').doc(id).valueChanges();
  }

  getUsersBookings(id: string|undefined): Observable<Booking[]|undefined>{
    return this.fireStore.collection<Booking>('bookings', ref=>ref.where('userUid','==', id)).valueChanges();
  }
}
