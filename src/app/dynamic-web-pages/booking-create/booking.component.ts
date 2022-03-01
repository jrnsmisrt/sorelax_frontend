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
import {Massage} from "../../model/Massage";

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit, AfterViewInit {
  uid!: string;
  timeslotCollection!: AngularFirestoreCollection<TimeSlot>;
  bookingCollection!: AngularFirestoreCollection<Booking>;
  timeslots$!: Observable<TimeSlot[]>;
  timeslots!: TimeSlot[];
  selectedTimeslot!: TimeSlot;
  confirmedTimeslot!: TimeSlot;
  formValid = false;

  dbMassages = this.fireStore.collection<Massage>('massages').valueChanges();
  dbMassage: Observable<any>|undefined;
  dbMassageDurations!: string[]
  selectedMassage!: Massage;
  confirmedMassage!: string;
  selectedDuration!: string;
  confirmedDuration!: string

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
    this.timeslots$ = this.timeslotCollection.valueChanges();

  }

  ngAfterViewInit(): void {
    $(document).ready(function () {
      $('.modal').modal();
    });
    this.initService.initSelect();


  }

  bookMassage() {
    this.fireStore.collection('bookings').add({
      userUid: firebase.auth().currentUser?.uid,
      timeslot: this.confirmedTimeslot.id,
      date: this.confirmedTimeslot.date,
      time: this.confirmedTimeslot.time,
      massage: this.confirmedMassage,
      duration: this.confirmedDuration,
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
      }).then(()=>{
        M.toast({html:'Uw boeking werd geplaatst'})
      })
    }).catch(error => {
      console.log('booking form error', error);
    })
  }

  changeMassage(typeOfMassage: any, massage: any) {
    this.dbMassage = this.getDbMassage(typeOfMassage.target.value);
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

  openModalMassageSelection(){
    let massageModal = M.Modal.getInstance(document.querySelector('#massageModal')!);
    massageModal.open();
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

  selectMassage(massage:Massage){
    this.selectedMassage = massage;
    this.setDurationArray(massage);
  }

  selectDuration(duration: string){
    this.selectedDuration = duration;
  }

  private setDurationArray(massage:Massage){
    this.dbMassageDurations = massage.duration;
  }

  confirmMassage(){
    this.confirmedMassage = this.selectedMassage.type;
    this.confirmedDuration = this.selectedDuration;
    this.bookingForm.patchValue({
      massage: this.selectedMassage,
      duration: this.selectedDuration
    });
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
