import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {InitService} from "../materialize/init.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-timeslot',
  templateUrl: './create-timeslot.component.html',
})
export class CreateTimeslotComponent implements OnInit {
  date!: string | number | string[] | undefined;
  startTime!: string | number | string[] | undefined;
  endTime!: string | number | string[] | undefined;

  timeslotForm = this.formBuilder.group({
    date: new FormControl('', [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required])
  })

  constructor(private fireStore: AngularFirestore,
              private formBuilder: FormBuilder,
              private init: InitService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.init.initDatePicker();
    this.init.initTimePicker();
    this.init.initModal();
    $(document).ready(function () {
      $('.endtimepicker').timepicker({
        twelveHour: false
      });
    });
  }

  createTimeslot() {
    this.timeslotForm.patchValue({
      date: this.date,
      startTime: this.startTime,
      endTime: this.endTime
    });
    this.fireStore.collection('timeslots').add({
      date: this.date,
      startTime: this.startTime,
      endTime: this.endTime,
    }).then((docRef) => {
      this.fireStore.collection('timeslots').doc(docRef.id).update({
        id: docRef.id
      })
    }).then(()=>{
      this.router.navigate(['timeslots/overview']);
      M.toast({html: `Timeslot created: ${this.date} from ${this.startTime} ${this.endTime}`, classes: 'rounded teal' })
    }).catch((error)=>{
      M.toast({html: error, classes: 'rounded red'});
    })
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

  setStartTime() {
    this.startTime = $('.timepicker').val();
    this.timeslotForm.patchValue({
      time: this.startTime
    });
  }

  setEndTime() {
    this.endTime = $('.endtimepicker').val();
    this.timeslotForm.patchValue({
      endTime: this.endTime
    });
  }
}
