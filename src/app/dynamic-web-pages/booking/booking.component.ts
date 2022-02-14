import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {InitService} from "../../materialize/init.service";
import {getAuth, onAuthStateChanged} from "@angular/fire/auth";
import {AuthService} from "../../services/auth.service";
import {TimeSlot} from "../../model/TimeSlot";
import {TimeslotService} from "../../services/timeslot.service";
import {Observable, of} from "rxjs";
import {where} from "@angular/fire/firestore";

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit, AfterViewInit {
  auth = getAuth();
  uid!: string;
  massages: any = ['Ontspanning', 'Boost', 'Sport', 'Anti-stress', 'Scrub'];
  durationMinutes: any = ['30', '60', '90'];
  timeslotCollection: AngularFirestoreCollection<TimeSlot>;
  timeslots$!: Observable<TimeSlot[]>;

  bookingForm = this.formBuilder.group({
    timeslot: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    time: new FormControl('', [Validators.required]),
    massage: new FormControl('', [Validators.required]),
    duration: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required])
  })

  constructor(private fireStore: AngularFirestore, private afAuth: AngularFireAuth,
              private formBuilder: FormBuilder,
              private initService: InitService,
              public afAuthService: AuthService,
              private timeSlotService: TimeslotService) {
    this.timeslotCollection = this.fireStore.collection<TimeSlot>('timeslots');
    this.timeslots$ = this.getTimeSlots();
  }


  ngOnInit(): void {
    this.initService.initSelect();
    this.initService.initDatePicker();
    this.initService.initTimePicker();

    document.addEventListener('DOMContentLoaded', function () {
      let elems = document.querySelectorAll('.modal');
      let instances = M.Modal.init(elems, {
        dismissible: true,
      });
    });

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.uid = user.uid.toString();
      }
    });

    this.timeslots$ = this.timeslotCollection.valueChanges();

  }

  getTimeSlots(): Observable<TimeSlot[]> {
    return this.timeslotCollection.valueChanges();
  }


  ngAfterViewInit(): void {
    this.initService.initParallax();
  }

  bookMassage() {
    this.bookingForm.patchValue({
      //  date: $('.datepicker').val(),
      //  time: $('.timepicker').val(),
      timeslot: $('#timeslotselector'.valueOf())
    })

    return this.fireStore.collection('bookings').doc().set({
      userUid: this.uid,
      requestedTimeslot: this.bookingForm.get(['timeslot'])?.value,
      date: this.bookingForm.get(['date'])?.value,
      time: this.bookingForm.get(['time'])?.value,
      massage: this.bookingForm.get(['massage'])?.value,
      duration: this.bookingForm.get(['duration'])?.value,
      personalMessage: this.bookingForm.get(['message'])?.value,
      requestedOn: new Date(Date.now()),
      status: 'pending'
    }).then(() => {
      this.fireStore.collection('timeslots').doc(`${this.timeslot?.value.uid}`).set({
        customerid: this.uid,
        date: this.timeslot?.value.date,
        time: this.timeslot?.value.time
      })
      this.bookingForm.reset();
    }).catch(error => {
      console.log('booking form error', error);
    })
  }

  changeMassage(typeOfMassage: any) {
    this.massage!.setValue(typeOfMassage.target.value, {
      onlySelf: true
    });
  }

  changeTimeSlot(timeslot: any) {
    this.timeslot!.setValue(timeslot.target.value, {
      onlySelf: true,
    })
  }

  changeDuration(minutes: any) {
    this.duration!.setValue(minutes.target.value, {
      onlySelf: true
    });
  }

  openModalBookingConfirmation() {
    let bookingModal = M.Modal.getInstance(document.querySelector('#bookingModal')!);
    bookingModal.open();
  }

  clear() {
    this.bookingForm.reset();
    M.toast({html: 'form has been cleared'});
  }

  get massage() {
    return this.bookingForm.get(['massage']);
  }

  get duration() {
    return this.bookingForm.get(['duration']);
  }

  get timeslot() {
    return this.bookingForm.get(['timeslot']);
  }
}
