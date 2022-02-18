import {Component, OnInit} from '@angular/core';
import {Booking} from "../../model/Booking";
import {Observable, Subscription} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {User} from "../../model/User";

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
  users$!:Observable<User[]>

  isAdmin!: boolean;


  constructor(private fireStore: AngularFirestore, private auth: AuthService, private userService: UserService) {
    this.bookingCollection = this.fireStore.collection('bookings');
    this.setAdmin();
    this.bookings$ = this.getAllBookings();
    this.users$ = this.userService.allUsers;
  }

  ngOnInit(): void {
    $(document).ready(function () {
      $('.modal').modal();
    });
  }


  getAllBookings(): Observable<Booking[]> {
    let userRole = this.userService.userRole;
    if (userRole === 'admin') {
      return this.fireStore.collection<Booking>('bookings').valueChanges();
    } else {
      return this.fireStore.collection<Booking>('bookings', ref => ref.where('userUid', '==', this.auth.getUserUid())).valueChanges();
    }
  }

  setBooking(bookingId: string) {
    this.booking$ = this.fireStore.doc<Booking>(`bookings/${bookingId}`).valueChanges();
  }


  private setAdmin() {
    this.userService.user.subscribe((user) => {
      let userRole = user.role;
      if (userRole === 'admin') {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    });
  }

  setUserName(uid: string) {
    this.userService.getUser(uid).subscribe((user) => {
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
    let booking = this.fireStore.doc<Booking>(`bookings/${bookingId}`).valueChanges();

    booking.subscribe((b) => {
      if (b?.status !== 'cancelled') {
        this.fireStore.doc<Booking>(`bookings/${bookingId}`).update({
          status: 'cancelled'
        }).catch(error => {
          console.log('confirm booking: ' + error);
        })
      }
    })
  }

  inheritSelectedBookingProperties(bookingId: string) {
    console.log("starting inherit");
    this.setBooking(bookingId);
    console.log(this.booking$);
    BookingOverviewComponent.openBookingModal();
    console.log("ending inherit");
  }

  private static openBookingModal() {
    M.Modal.getInstance(document.getElementById('statusmodal')!).open();
  }
}
