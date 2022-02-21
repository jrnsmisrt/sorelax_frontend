import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {InitService} from "../../materialize/init.service";
import {getAuth, onAuthStateChanged} from "@angular/fire/auth";
import {AuthService} from "../../services/auth.service";
import {TimeSlot} from "../../model/TimeSlot";
import {Observable} from "rxjs";
import {Booking} from "../../model/Booking";
import {Router} from "@angular/router";

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
  confirmedTimeslot!:TimeSlot;

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

  }


  ngOnInit(): void {
    this.bookingCollection = this.fireStore.collection<Booking>('bookings');
    this.timeslotCollection = this.fireStore.collection<TimeSlot>('timeslots');
    // @ts-ignore
    this.timeslots$ = this.getTimeslots();

    this.initService.initSelect();
    this.initService.initDatePicker();
    this.initService.initTimePicker();

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.uid = user.uid.toString();
      }
    });

    this.timeslots$ = this.timeslotCollection.valueChanges();

  }

  ngAfterViewInit(): void {
    this.initService.initParallax();
    $(document).ready(function(){
      $('select').formSelect();
    });
    $(document).ready(function () {
      $('.modal').modal();
    });

  }

  bookMassage() {
    return this.fireStore.collection('bookings').doc().set({
      userUid: this.uid,
      timeslot: this.confirmedTimeslot.id,
      date: this.confirmedTimeslot.date,
      time: this.confirmedTimeslot.time,
      massage: this.bookingForm.get(['massage'])?.value,
      duration: this.bookingForm.get(['duration'])?.value,
      personalMessage: this.bookingForm.get(['message'])?.value,
      requestedOn: JSON.stringify(new Date(Date.now())),
      status: 'pending'
    }).then(() => {
      this.fireStore.collection('timeslots').doc(`${this.confirmedTimeslot.id}`).update({
        customerid: this.uid,
        test: "test",
        isAvailable: false
      });
      this.router.navigate([`users/${this.afAuthService.getUserUid()}/booking-overview`])
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
  openModalTimeslotSelection(){
    let timeslotModal = M.Modal.getInstance(document.querySelector('#timeslotModal')!);
    timeslotModal.open();
  }
  getTimeslots():Observable<TimeSlot[]>{
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

}
