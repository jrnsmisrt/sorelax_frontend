import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {InitService} from "../materialize/init.service";
import {AuthService} from "../services/auth.service";
import {TimeSlot} from "../model/TimeSlot";
import {Observable} from "rxjs";
import {Booking} from "../model/Booking";
import {Router} from "@angular/router";
import firebase from "firebase/compat/app";
import {Massage} from "../model/Massage";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
})
export class BookingComponent implements OnInit {
  uid!: string;
  timeslotCollection!: AngularFirestoreCollection<TimeSlot>;
  bookingCollection!: AngularFirestoreCollection<Booking>;
  timeslots$!: Observable<TimeSlot[]>;
  timeslots!: TimeSlot[];
  selectedTimeslot!: TimeSlot;
  confirmedTimeslot!: TimeSlot;
  formValid = false;

  dbMassages = this.fireStore.collection<Massage>('massages').valueChanges();
  dbMassage: Observable<any> | undefined;
  dbMassageDurations!: string[]
  selectedMassage!: Massage;
  confirmedMassage!: string;
  selectedDuration!: string;
  confirmedDuration!: string
  bookingForm!: FormGroup;

  arrayOfDates: string[] = [];
  timeslotDatePickerDateSelected!: string;
  timeslotPickedTime!: string;

  timeslotsPickedDate!: TimeSlot[];


  constructor(private fireStore: AngularFirestore, private afAuth: AngularFireAuth,
              private formBuilder: FormBuilder,
              private initService: InitService,
              public afAuthService: AuthService,
              private router: Router,
              private userService: UserService) {
  }


  ngOnInit(): void {
    this.bookingCollection = this.fireStore.collection<Booking>('bookings');
    this.timeslotCollection = this.fireStore.collection<TimeSlot>('timeslots', ref => ref.orderBy('date', 'asc').orderBy('startTime', 'asc'));
    this.setTimeslotDates();

    this.bookingForm = this.formBuilder.group({
      timeslot: ['', [Validators.required]],
      massage: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      preferredHour: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      preferredMinute: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      message: ['']
    })
    this.timeslots$ = this.getTimeslots();
    this.timeslots$ = this.timeslotCollection.valueChanges();
    this.initService.initModal();

    $(document).ready(() => {
      let currYear = (new Date()).getFullYear();
      let currMonth = (new Date()).getMonth();
      let currDay = (new Date()).getDay();
      $(".timeslotdatepicker").datepicker({
          format: 'dd/mm/yyyy',
          defaultDate: new Date(currYear, currMonth, (currDay + 1)),
          minDate: new Date(currYear, currMonth, (currDay + 1)),
          autoClose: true,
          disableDayFn: (date) => {
            let convertedDate = date.toLocaleString('en-GB').slice(0, 10);
            return !this.arrayOfDates.includes(convertedDate);
          },
          onSelect: (date) => {
            let selectedDate = date.toLocaleString('en-GB').slice(0, 10);
            this.timeslotDatePickerDateSelected = selectedDate;
            this.getTimeSlotsFromDate(this.timeslotDatePickerDateSelected);
            M.Datepicker.getInstance(document.getElementById('timeslotdatepicker')!).close();
          }
        },
      );
    });

  }

  getTimeSlotsFromDate(date: string) {
    this.fireStore.collection<TimeSlot>('timeslots', ref => ref.where('date', '==', date))
      .valueChanges()
      .subscribe((timeslots) => {
        let timeslotsArray = timeslots;
        this.timeslotsPickedDate = timeslotsArray;
      });
  }

  setTimeslotDates() {
    this.getTimeslots().subscribe((data) => {
      data.forEach((timeslot) => {
        if (!this.arrayOfDates.includes(timeslot.date)) {
          this.arrayOfDates.push(timeslot.date);
        }
      });
    })
  }

  getDates() {
    return this.arrayOfDates;
  }


  bookMassage() {
    let numericalpreferredTime = this.preferredHour?.value + this.preferredMinute?.value;
    let numericalTimeslotEndTime = this.confirmedTimeslot.endTime.slice(0, 2) + this.confirmedTimeslot.endTime.slice(3);
    let numericalTimeslotstartTime = this.confirmedTimeslot.startTime.slice(0, 2) + this.confirmedTimeslot.startTime.slice(3);
    let numericalDuration = BookingComponent.getNumericalDuration(Number(this.confirmedDuration));

    if (numericalpreferredTime <= (Number(numericalTimeslotEndTime) - numericalDuration) && numericalpreferredTime >= numericalTimeslotstartTime) {

      this.fireStore.collection('bookings').add({
        userUid: firebase.auth().currentUser?.uid,
        timeslot: this.confirmedTimeslot.id,
        date: this.confirmedTimeslot.date,
        time: this.confirmedTimeslot.startTime,
        preferredHour: this.preferredHour?.value,
        preferredMinute: this.preferredMinute?.value,
        preferredTime: this.preferredTime,
        massage: this.confirmedMassage,
        duration: this.confirmedDuration,
        personalMessage: this.bookingForm.get(['message'])?.value,
        requestedOn: JSON.stringify(new Date(Date.now())),
        status: 'pending'
      }).then((docRef) => {
        this.fireStore.collection('bookings').doc(docRef.id).update({
          id: docRef.id
        }).then(() => {
          M.toast({html: 'Uw boeking werd geplaatst', classes: 'rounded teal'})
          this.fireStore.collection('mail').add({
            to: firebase.auth().currentUser?.email,
            from: 'info@sorelax.be',
            message: {
              subject: 'Boeking Sorelax',
              html: `<code>Beste,<br>
                bedankt om te boeken bij sorelax! <br>
                U hebt een boeking geplaatst voor:<br>
                <strong>${this.confirmedMassage}</strong> massage op ${this.confirmedTimeslot.date} om ${this.preferredTime} voor ${this.confirmedDuration} minuten<br>
                U zal nog een e-mail krijgen ter bevestiging/annulatie van deze boeking.

                Mvg,
                Sofie
                </code>`,
            },
          }).then(async () => {
            let user = this.userService.getUser(firebase.auth().currentUser?.uid);
            await user.subscribe((user) => {
              this.fireStore.collection('mail').add({
                to: 'sverkouille@hotmail.com',
                from: 'web@sorelax.be',
                message: {
                  subject: `Nieuwe boeking van ${user?.firstName} ${user?.lastName}`,
                  html: `<code>Beste,<br>
                Nieuwe boeking van ${user?.firstName} ${user?.lastName} <br>
                <strong>${this.confirmedMassage}</strong> massage op ${this.confirmedTimeslot.date} om ${this.preferredTime} voor ${this.confirmedDuration} minuten<br>
               </code>`,
                },
              })
            });
          }).catch((error) => {
            M.toast({html: error, classes: 'rounded red'});
          })
        }).then(() => {
          this.router.navigate([`users/${this.afAuthService.getUserUid()}/booking-overview`])
        })
      }).catch(error => {
        M.toast({html: error, classes: 'rounded red'});
      })
    } else {
      M.toast({html: 'Uw voorkeurs tijdstip valt buiten de geselecteerde timeslot', classes: 'rounded red'});
    }
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

  openModalMassageSelection() {
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

  confirmTimeslot(timeslot: TimeSlot) {
    this.confirmedTimeslot = timeslot;
    this.bookingForm.patchValue({
      timeslot: timeslot.id
    })
    M.toast({
      html: `Timeslot op ${this.confirmedTimeslot.date} om ${this.confirmedTimeslot.startTime} geselecteerd`,
      classes: 'rounded teal'
    });
  }

  selectTimeslot(timeslot: any) {
    this.selectedTimeslot = timeslot;
  }

  selectMassage(massage: Massage) {
    this.selectedMassage = massage;
    this.setDurationArray(massage);
    this.bookingForm.patchValue({
      massage: this.selectedMassage.type
    })
  }

  selectDuration(duration: string) {
    this.selectedDuration = duration;
    this.bookingForm.patchValue({
      duration: this.selectedDuration
    });
    this.confirmMassage();
  }

  private setDurationArray(massage: Massage) {
    this.dbMassageDurations = massage.duration;
  }

  confirmMassage() {
    this.confirmedMassage = this.selectedMassage.type;
    this.confirmedDuration = this.selectedDuration;
    this.bookingForm.patchValue({
      massage: this.selectedMassage,
      duration: this.selectedDuration
    });
    M.toast({
      html: `${this.confirmedMassage} massage van ${this.confirmedDuration} min geselecteerd`,
      classes: 'rounded teal'
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

  get preferredHour() {
    return this.bookingForm.get(['preferredHour']);
  }

  get preferredMinute() {
    return this.bookingForm.get(['preferredMinute']);
  }

  get preferredTime() {
    return `${this.preferredHour?.value} : ${this.preferredMinute?.value}`;
  }

  private static getNumericalDuration(duration: number): number {
    switch (duration) {
      case 90:
        return (90 + 60);
      case 60:
        return (60 + 40);
      case 30:
        return (30 + 40);
      case 15:
        return (15 + 40);
      default:
        return duration;
    }
  }
}
