import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {TimeSlot} from "../model/TimeSlot";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {User} from "../model/User";
import {InitService} from "../materialize/init.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-timeslot-overview',
  templateUrl: './timeslot-overview.component.html',
})
export class TimeslotOverviewComponent implements OnInit {
  timeslots!: Observable<TimeSlot[]>;
  users!: Observable<User[]>;
  timeslotId!: string;
  adjustTimeslotForm!: FormGroup;


  constructor(private fireStore: AngularFirestore,
              private init: InitService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.init.initModal();
    this.timeslots = this.fireStore.collection<TimeSlot>('timeslots', ref => ref.orderBy('date', 'asc').orderBy('startTime', 'asc')).valueChanges();
    this.users = this.fireStore.collection<User>('users').valueChanges();

    this.adjustTimeslotForm = this.formBuilder.group({
      day: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      hour: ['', Validators.required],
      minutes: ['', Validators.required],
      date: [''],
      time: ['']
    })
  }

  openAdjustTimeslotModal(id: string) {
    this.timeslotId = id;
    M.Modal.getInstance(document.getElementById('adjustTimeslotModal')!).open();
  }

  openRemoveTimeslotModal(id: string) {
    this.timeslotId = id;
    M.Modal.getInstance(document.getElementById('removeTimeslotModal')!).open();
  }

  adjustTimeSlotModal() {
    this.adjustTimeslotForm.patchValue({
      date: `${this.day}/${this.month}/${this.year}`,
      time: `${this.hour}:${this.minutes}`
    });
    this.fireStore.collection('timeslots').doc(this.timeslotId).update({
      date: this.date,
      time: this.time,
    }).catch((err)=>{
      M.toast({html: err});
    });
  }

  removeTimeslot() {
    this.fireStore.collection<TimeSlot>('timeslots').doc(this.timeslotId).delete()
      .catch((err) => {
        M.toast({html: err, classes: 'rounded red'});
      });
  }

  get date() {
    return this.adjustTimeslotForm.get(['date'])?.value;
  }

  get time() {
    return this.adjustTimeslotForm.get(['time'])?.value;
  }

  get day() {
    return this.adjustTimeslotForm.get(['day'])?.value;
  }

  get month() {
    return this.adjustTimeslotForm.get(['month'])?.value;
  }

  get year() {
    return this.adjustTimeslotForm.get(['year'])?.value;
  }

  get hour(){
    return this.adjustTimeslotForm.get(['hour'])?.value;
  }
  get minutes(){
    return this.adjustTimeslotForm.get(['minutes'])?.value;
  }

}
