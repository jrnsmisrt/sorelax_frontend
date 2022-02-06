import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {InitService} from "../../materialize/init.service";
import {getAuth, onAuthStateChanged} from "@angular/fire/auth";

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit, AfterViewInit {
  auth = getAuth();
  uid!: string;
  massages: any = ['Ontspanning','Boost', 'Sport', 'Anti-stress', 'Scrub'];
  durationMinutes: any = ['30', '60', '90'];

  bookingForm = this.formBuilder.group({
    date: new FormControl('', [Validators.required]),
    time: new FormControl('', [Validators.required]),
    massage: new FormControl( '', [Validators.required]),
    duration: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required])
  })

  constructor(private afStore: AngularFirestore, private afAuth: AngularFireAuth,
              private formBuilder: FormBuilder,
              private initService: InitService) {

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

  }

  ngAfterViewInit(): void {
    this.initService.initParallax();
  }

  bookMassage() {
    this.bookingForm.patchValue({
      date: $('.datepicker').val(),
      time: $('.timepicker').val()
    })

    return this.afStore.collection('bookings').doc().set({
      userUid: this.uid,
      date: this.bookingForm.get(['date'])?.value,
      time: this.bookingForm.get(['time'])?.value,
      massage: this.bookingForm.get(['massage'])?.value,
      duration: this.bookingForm.get(['duration'])?.value,
      personalMessage: this.bookingForm.get(['message'])?.value,
      requestedOn: new Date(Date.now()),
      status: 'pending'
    }).then(() => {
      this.bookingForm.reset();
    }).catch(error => {
      console.log('booking form error', error);
    })
  }

  changeMassage(typeOfMassage:any) {
    this.massage!.setValue(typeOfMassage.target.value, {
      onlySelf: true
    });
  }

  changeDuration(minutes:any){
    this.duration!.setValue(minutes.target.value,{
      onlySelf: true
    });
  }

  openModalBookingConfirmation(){
    let bookingModal = M.Modal.getInstance(document.querySelector('#bookingModal')!);
    bookingModal.open();
  }

  clear() {
    this.bookingForm.reset();
    M.toast({html: 'form has been cleared'});
  }

  get massage(){
    return this.bookingForm.get(['massage']);
  }

  get duration(){
    return this.bookingForm.get(['duration']);
  }
}
