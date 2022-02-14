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
    this.bookings$ = this.getAllBookings();
  }

  getAllBookings(): Observable<Booking[]> {
    let userRole = this.userService.userRole;
    if (userRole === 'admin') {
       return this.fireStore.collection<Booking>('bookings').valueChanges();
      }
    else {
      console.log(this.auth.getUserUid());
      console.log(this.auth.user$.role);
      return this.fireStore.collection<Booking>('bookings', ref => ref.where('userUid', '==', this.auth.getUserUid())).valueChanges();
    }
  }


  private setAdmin() {
    this.userService.user.subscribe((user) => {
      let userRole = user.role;
      if (userRole === 'admin') {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
      console.log(this.isAdmin);
    });
  }

  ngOnInit(): void {
  }

}
