import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {InitService} from "../../materialize/init.service";
import {getAuth, onAuthStateChanged} from "@angular/fire/auth";
import {AuthService} from "../../services/auth.service";
import {TimeSlot} from "../../model/TimeSlot";
import {Observable, of, Subscription} from "rxjs";
import {Booking} from "../../model/Booking";
import {Time} from "@angular/common";

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
  timeslotCollection!: AngularFirestoreCollection<TimeSlot>;
  bookingCollection!: AngularFirestoreCollection<Booking>;
  timeslots$!: Observable<TimeSlot[]>;
  timeslots!: TimeSlot[];
  selectedTimeslot!:TimeSlot;

  bookingForm = this.formBuilder.group({
    timeslot: new FormControl('', [Validators.required]),
    massage: new FormControl('', [Validators.required]),
    duration: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required])
  })

  constructor(private fireStore: AngularFirestore, private afAuth: AngularFireAuth,
              private formBuilder: FormBuilder,
              private initService: InitService,
              public afAuthService: AuthService) {

  }


  ngOnInit(): void {
    this.bookingCollection = this.fireStore.collection<Booking>('bookings');
    this.timeslotCollection = this.fireStore.collection<TimeSlot>('timeslots');
    // @ts-ignore
    this.timeslots$ = this.getTimeslots();
    this.setTimeslotArray();

    this.initService.initSelect();
    this.initService.initDatePicker();
    this.initService.initTimePicker();

    $(document).ready(function () {
      $('.modal').modal();
    });

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.uid = user.uid.toString();
      }
    });

    this.timeslots$ = this.timeslotCollection.valueChanges();

  }

  ngAfterViewInit(): void {
    this.initService.initParallax();
  }

  bookMassage() {
    return this.fireStore.collection('bookings').doc().set({
      userUid: this.uid,
      timeslot: this.selectedTimeslot.id,
      date: this.selectedTimeslot.date,
      time: this.selectedTimeslot.time,
      massage: this.bookingForm.get(['massage'])?.value,
      duration: this.bookingForm.get(['duration'])?.value,
      personalMessage: this.bookingForm.get(['message'])?.value,
      requestedOn: JSON.stringify(new Date(Date.now())),
      status: 'pending'
    }).then(() => {
      this.fireStore.collection('timeslots').doc(`${this.selectedTimeslot.id}`).update({
        customerid: this.uid,
        test: "test",
        isAvailable: false
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

  getTimeslots():Observable<TimeSlot[]>{
    return this.timeslotCollection.valueChanges();
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

  selectTimeslotChange(timeslot: any) {
    this.selectedTimeslot = timeslot;
    console.log(this.selectedTimeslot.date+' '+this.selectedTimeslot.time);
  }

  private setTimeslotArray() {
    this.timeslots$.subscribe((t)=>{
      this.timeslots = t;
    })
    console.log(this.timeslots);
  }
}
