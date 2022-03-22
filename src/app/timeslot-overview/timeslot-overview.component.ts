import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {TimeSlot} from "../model/TimeSlot";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {User} from "../model/User";

@Component({
  selector: 'app-timeslot-overview',
  templateUrl: './timeslot-overview.component.html',
})
export class TimeslotOverviewComponent implements OnInit {
  timeslots!: Observable<TimeSlot[]>;
  users!: Observable<User[]>;

  constructor(private fireStore: AngularFirestore) {
  }

  ngOnInit(): void {
    this.timeslots = this.fireStore.collection<TimeSlot>('timeslots', ref => ref.orderBy('date', 'asc').orderBy('startTime', 'asc').orderBy('isAvailable', 'desc')).valueChanges();
    this.users = this.fireStore.collection<User>('users').valueChanges();
  }



}
