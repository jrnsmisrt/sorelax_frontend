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
      day: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2), Validators.pattern('^[0-9]*$')]],
      month: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2), Validators.pattern('^[0-9]*$')]],
      year: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('^[0-9]*$')]],
      startHour: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(2), Validators.pattern('^[0-9]*$')]],
      startMinutes: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2), Validators.pattern('^[0-9]*$')]],
      endHour: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2), Validators.pattern('^[0-9]*$')]],
      endMinutes: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2), Validators.pattern('^[0-9]*$')]],
      date: [''],
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
    if(this.adjustTimeslotForm.valid){
    this.adjustTimeslotForm.patchValue({
      date: `${this.day}/${this.month}/${this.year}`,
      startTime: `${this.startHour}:${this.startMinutes}`,
      endTime: `${this.endHour}:${this.endMinutes}`
    });
    this.fireStore.collection('timeslots').doc(this.timeslotId).update({
      date: this.date,
      startTime: `${this.startHour}:${this.startMinutes}`,
      endTime: `${this.endHour}:${this.endMinutes}`,
    }).catch((err)=>{
      M.toast({html: err});
    });
    M.Modal.getInstance(document.getElementById('adjustTimeslotModal')!).close();
    }
    else{
      return;
    }
  }

  removeTimeslot() {
    this.fireStore.collection<TimeSlot>('timeslots').doc(this.timeslotId).delete()
      .catch((err) => {
        M.toast({html: err, classes: 'rounded red'});
      });
    M.Modal.getInstance(document.getElementById('removeTimeslotModal')!).close();
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

  get startHour(){
    return this.adjustTimeslotForm.get(['startHour'])?.value;
  }
  get startMinutes(){
    return this.adjustTimeslotForm.get(['startMinutes'])?.value;
  }
  get endHour(){
    return this.adjustTimeslotForm.get(['endHour'])?.value;
  }
  get endMinutes(){
    return this.adjustTimeslotForm.get(['endMinutes'])?.value;
  }

}
