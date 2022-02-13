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

  createTimeSlot(date: Date): void {
    let newTimeSlot: TimeSlot = new TimeSlot(date);
    this.timeSlots.push(newTimeSlot);
    this.fireStore.collection('timeslots').doc().set({
      id: newTimeSlot.id,
      dateTime: newTimeSlot.dateTime,
      customerId: newTimeSlot.customerId,
      isAvailable: newTimeSlot.isAvailable
    }).then(() => {
      M.toast({html:`New timeslot has been created: ${newTimeSlot.dateTime.toString()}`});
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
