import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {FormBuilder, FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-timeslot',
  templateUrl: './create-timeslot.component.html',
  styleUrls: ['./create-timeslot.component.css']
})
export class CreateTimeslotComponent implements OnInit {
  date!: string | number | string[] | undefined;
  time!: string | number | string[] | undefined;

  timeslotForm = this.formBuilder.group({
    date: new FormControl('', [Validators.required]),
    time: new FormControl('', [Validators.required])
  })

  constructor(private fireStore: AngularFirestore,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    $(document).ready(function () {
      $('.datepicker').datepicker({
        format: "dd/mm/yyyy",
        //maxDate: new Date(new Date().getFullYear()+1),
        minDate: new Date(Date.now())
      });
    });
    $(document).ready(function () {
      $('.timepicker').timepicker({
        twelveHour: false
      });
    });
    $(document).ready(function () {
      $('.modal').modal({
        preventScrolling: true,
      });
    });
  }

  createTimeslot() {
    this.timeslotForm.patchValue({
      date: this.date,
      time: this.time
    });
    this.fireStore.collection('timeslots').add({
      date: this.date,
      time: this.time,
      isAvailable: true,
      confirmed: false
    }).then((docRef)=>{
      this.fireStore.collection('timeslots').doc(docRef.id).update({
        id: docRef.id
      })
    })

    /*
    if (this.timeslotForm.invalid) {
      this.timeslotForm.markAllAsTouched();
    } else {
      return this.fireStore.collection('timeslots').doc().set({
        date: this.date,
        time: this.time,
        isAvailable: true,
        confirmed: false
      }).then(() => {
        this.timeslotForm.reset();
      }).catch(error => {
        console.log('timeslot form error', error);
      })
    }*/
  }

  openTimeslotModal() {
    let timeslotModal = M.Modal.getInstance(document.querySelector('#timeslotModal')!);
    timeslotModal.open();
  }

  confirmTimeslot() {
    this.createTimeslot();
  }

  setDate() {
    this.date = $('.datepicker').val();
    this.timeslotForm.patchValue({
      date: this.date
    });
  }

  setTime() {
    this.time = $('.timepicker').val();
    this.timeslotForm.patchValue({
      time: this.time
    });
  }
}
