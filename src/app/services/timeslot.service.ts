import {Injectable} from '@angular/core';
import {Time} from "@angular/common";
import {TimeSlot} from "../model/TimeSlot";


@Injectable({
  providedIn: 'root'
})
export class TimeslotService {
  currentDateTime: number = Date.now();
  timeSlots!: TimeSlot[];
  deletedTimeSlots!: TimeSlot[];
  createdTimeSlot!: TimeSlot;


  constructor() {
  }

  createTimeSlot(date: Date): void {
    let newTimeSlot: TimeSlot = new TimeSlot(date);
    this.timeSlots.push(newTimeSlot);
  }

  getAllTimeSlots(): TimeSlot[] {
    return this.timeSlots;
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
