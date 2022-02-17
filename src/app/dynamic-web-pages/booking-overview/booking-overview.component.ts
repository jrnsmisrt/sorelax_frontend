import {Component, OnInit} from '@angular/core';
import {Booking} from "../../model/Booking";
import {Observable, Subscription} from "rxjs";
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
  booking$!: Observable<Booking|undefined>;

  changeBookingStatusId: string|undefined;
  changeBookingStatus: string|undefined;

  bookingUserFullName!:string;

  isAdmin!: boolean;


  constructor(private fireStore: AngularFirestore, private auth: AuthService, private userService: UserService) {
    this.bookingCollection = this.fireStore.collection('bookings');
    this.setAdmin();
    this.bookings$ = this.getAllBookings();
  }
  ngOnInit(): void {
    $(document).ready(function(){
      $('.modal').modal();
    });
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

  setBooking(bookingId:string){
    this.booking$ =  this.fireStore.doc<Booking>(`bookings/${bookingId}`).valueChanges();
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

  setUserName(uid: string){
   this.userService.getUser(uid).subscribe((user)=>{
     console.log(user?.firstName)
     this.bookingUserFullName = user?.firstName+user?.lastName!;
     console.log(this.bookingUserFullName);
   });
  }

  confirmBooking(bookingId: string) {
    let booking = this.fireStore.doc<Booking>(`bookings/${bookingId}`).valueChanges();
    booking.subscribe((b)=>{
      if(b?.status!=='confirmed'){
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

  inheritSelectedBookingProperties(bookingId:string, bookingStatus:string) {
    console.log(bookingStatus); console.log(bookingId);
    this.changeBookingStatus =  bookingStatus;
    this.setBooking(bookingId);
    console.log(this.booking$);
    console.log(this.changeBookingStatusId); console.log(this.changeBookingStatus);
    this.openBookingModal();
  }

  private openBookingModal() {
    M.Modal.getInstance(document.getElementById('statusmodal')!).open();
  }
}
