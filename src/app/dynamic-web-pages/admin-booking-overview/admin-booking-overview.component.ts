import { Component, OnInit } from '@angular/core';
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
  bookings$!:Observable<Booking[]>;
  users$!:Observable<User[]>;
  user!: User | undefined;
  constructor(private fireStore: AngularFirestore, private userService: UserService) {
    this.bookings$ = this.fireStore.collection<Booking>('bookings', ref => ref.orderBy('date', 'asc').orderBy('time', 'asc')).valueChanges();
    this.users$ = this.fireStore.collection<User>('users').valueChanges();
  }

  ngOnInit(): void {
  }

  setUser(id:string){
    this.fireStore.collection<User>('users').doc(id).valueChanges().subscribe((user) => {
      console.log(user?.firstName);
      return this.user = user;
    })}

}
