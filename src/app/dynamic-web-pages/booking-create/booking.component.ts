import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {InitService} from "../../materialize/init.service";
import {AuthService} from "../../services/auth.service";
import {TimeSlot} from "../../model/TimeSlot";
import {Observable} from "rxjs";
import {Booking} from "../../model/Booking";
import {Router} from "@angular/router";
import firebase from "firebase/compat/app";
import {collection, doc, setDoc} from "@angular/fire/firestore";
import {newArray} from "@angular/compiler/src/util";

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit, AfterViewInit {
  uid!: string;
  // massages: any = ['Ontspanning', 'Boost', 'Sport', 'Anti-stress', 'Scrub'];
  // durationMinutes!: string[];
  // ontspanningDuration = ['30', '60', '90'];
  // boostDuration = ['15', '30'];
  // sportDuration = ['15', '30'];
  // antiStressDuration = ['15', '30'];
  // scrubDuration = ['15', '30', '60', '90'];
  timeslotCollection!: AngularFirestoreCollection<TimeSlot>;
  bookingCollection!: AngularFirestoreCollection<Booking>;
  timeslots$!: Observable<TimeSlot[]>;
  timeslots!: TimeSlot[];
  selectedTimeslot!: TimeSlot;
  confirmedTimeslot!: TimeSlot;
  formValid = false;

  dbMassages = this.fireStore.collection('massages').valueChanges();
  dbMassage: Observable<any>|undefined;


  bookingForm = this.formBuilder.group({
    timeslot: new FormControl('', [Validators.required]),
    massage: new FormControl('', [Validators.required]),
    duration: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required])
  })

  constructor(private fireStore: AngularFirestore, private afAuth: AngularFireAuth,
              private formBuilder: FormBuilder,
              private initService: InitService,
              public afAuthService: AuthService,
              private router: Router) {
   // this.setDuration(this.massage?.value)
  }


  ngOnInit(): void {
    this.bookingCollection = this.fireStore.collection<Booking>('bookings');
    this.timeslotCollection = this.fireStore.collection<TimeSlot>('timeslots');
    // @ts-ignore
    this.timeslots$ = this.getTimeslots();

    this.initService.initSelect();
    this.initService.initDatePicker();
    this.initService.initTimePicker();

    this.timeslots$ = this.timeslotCollection.valueChanges();

  }

  ngAfterViewInit(): void {
    this.initService.initParallax();
    $(document).ready(function () {
      $('select').formSelect();
    });
    $(document).ready(function () {
      $('.modal').modal();
    });

  }

  bookMassage() {
    this.fireStore.collection('bookings').add({
      userUid: firebase.auth().currentUser?.uid,
      timeslot: this.confirmedTimeslot.id,
      date: this.confirmedTimeslot.date,
      time: this.confirmedTimeslot.time,
      massage: this.bookingForm.get(['massage'])?.value,
      duration: this.bookingForm.get(['duration'])?.value,
      personalMessage: this.bookingForm.get(['message'])?.value,
      requestedOn: JSON.stringify(new Date(Date.now())),
      status: 'pending'
    }).then((docRef) => {
      this.fireStore.collection('bookings').doc(docRef.id).update({
        id: docRef.id
      }).then(() => {
        console.log(this.confirmedTimeslot.id);
        this.fireStore.collection('timeslots').doc(this.confirmedTimeslot.id).update({
          customerid: firebase.auth().currentUser?.uid,
          test: "test",
          isAvailable: false
        });
        this.router.navigate([`users/${this.afAuthService.getUserUid()}/booking-overview`])
      })
    }).catch(error => {
      console.log('booking form error', error);
    })
  }

  // setDuration(massage: string | undefined) {
  //   if(massage==='Ontspanning') this.durationMinutes = this.ontspanningDuration;
  //   if(massage==='Boost')this.durationMinutes = this.boostDuration;
  //   if(massage==='Sport')this.durationMinutes = this.sportDuration;
  //   if(massage==='Anti-stress')this.durationMinutes = this.antiStressDuration;
  //   if(massage==='Scrub')this.durationMinutes = this.scrubDuration;
  //
  //
  // }

  changeMassage(typeOfMassage: any, massage: any) {
    this.dbMassage = this.getDbMassage(typeOfMassage.target.value);
    // this.setDuration(typeOfMassage.target.value);
    this.massage!.setValue(typeOfMassage.target.value, {
      onlySelf: true
    });
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


  openModalTimeslotSelection() {
    let timeslotModal = M.Modal.getInstance(document.querySelector('#timeslotModal')!);
    timeslotModal.open();
  }

  getTimeslots(): Observable<TimeSlot[]> {
    return this.timeslotCollection.valueChanges();
  }

  confirmTimeslot() {
    this.confirmedTimeslot = this.selectedTimeslot;
  }

  selectTimeslot(timeslot: any) {
    this.selectedTimeslot = timeslot;
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

  private getDbMassage(massage: string) {
    return this.fireStore.collection('massages').doc(massage).valueChanges();
  }
}
