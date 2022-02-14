import {Component, OnInit} from '@angular/core';
import {Booking} from "../../model/Booking";
import {Observable} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {getFirestore} from "@angular/fire/firestore";

@Component({
  selector: 'app-booking-overview',
  templateUrl: './booking-overview.component.html',
  styleUrls: ['./booking-overview.component.css']
})
export class BookingOverviewComponent implements OnInit {
  bookingCollection!: AngularFirestoreCollection<Booking>;
  bookings$!: Observable<Booking[]>;

  constructor(private fireStore : AngularFirestore) {
    this.bookingCollection = this.fireStore.collection('bookings');
    this.getAllBookings();
  }

  private getAllBookings():Observable<Booking[]>{
   return this.bookings$ = this.bookingCollection.valueChanges();
  }

  ngOnInit(): void {
  }

}
