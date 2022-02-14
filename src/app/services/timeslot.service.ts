import {Injectable} from '@angular/core';
import {Time} from "@angular/common";
import {TimeSlot} from "../model/TimeSlot";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {collection, getFirestore, onSnapshot, orderBy, query} from "@angular/fire/firestore";


@Injectable({
  providedIn: 'root'
})
export class TimeslotService {
  currentDateTime: number = Date.now();
  timeSlots!: TimeSlot[];
  deletedTimeSlots!: TimeSlot[];
  createdTimeSlot!: TimeSlot;


  constructor(private fireStore: AngularFirestore) {
  }

  createTimeSlot(date: string, time: string): void {
    let newTimeSlot: TimeSlot = new TimeSlot(date, time);
    this.timeSlots.push(newTimeSlot);
    this.fireStore.collection('timeslots').doc().set({
      id: newTimeSlot.id,
      date: newTimeSlot.date,
      time: newTimeSlot.time,
      isAvailable: newTimeSlot.isAvailable,
      confirmed: newTimeSlot.confirmed
    }).then(() => {
      M.toast({html:`New timeslot has been created: ${newTimeSlot.date} - ${newTimeSlot.time}`});
    });
  }


  deleteTimeSlot(timeSlot: TimeSlot): void {
    this.timeSlots.forEach((element, index) => {
      if (element == timeSlot) {

        this.deletedTimeSlots.push(timeSlot);
        delete this.timeSlots[index];

      }
    });

  }

}
