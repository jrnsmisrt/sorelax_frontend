import {Component, OnInit} from '@angular/core';
import {Booking} from "../../model/Booking";
import {Observable} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-booking-overview',
  templateUrl: './booking-overview.component.html',
  styleUrls: ['./booking-overview.component.css']
})
export class BookingOverviewComponent implements OnInit {
  bookingCollection!: AngularFirestoreCollection<Booking>;
  bookings$!: Observable<Booking[]>;
  isAdmin!: boolean;

  constructor(private fireStore: AngularFirestore, private auth: AuthService, private userService: UserService) {
    this.bookingCollection = this.fireStore.collection('bookings');
    this.setAdmin();
    this.getAllBookings();
    this.fireStore.collection('bookings', ref => ref.where('uid', '==', this.auth.getUserUid())).valueChanges();

  }

  getAllBookings(): Observable<Booking[]> {
    if (!this.isAdmin) {
      return this.fireStore.collection<Booking>('bookings', ref => ref.where('uid', '==', this.auth.getUserUid())).valueChanges()
    }
    return this.bookings$ = this.bookingCollection.valueChanges();
  }


  private setAdmin() {
    this.userService.currentUser.subscribe((user) => {
      this.isAdmin = user.role === 'admin';
    })
  }

  ngOnInit(): void {
  }

}
