import {Time} from "@angular/common";

export class TimeSlot {
  private _id!: string;
  private _customerId!: string;
  private _dateTime!: Date;
  private _isAvailable: boolean = false;

  constructor(dateTime: Date) {

    this._dateTime = dateTime;

  }

  confirmAvailability() {
    if (this._dateTime.getDate() < Date.now()) {
      this._isAvailable = true;
    }
    this._isAvailable = false;
  }


  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get customerId(): string {
    return this._customerId;
  }

  set customerId(value: string) {
    this._customerId = value;
  }

  get dateTime(): Date {
    return this._dateTime;
  }

  set dateTime(value: Date) {
    this._dateTime = value;
  }

  get isAvailable(): boolean {
    return this._isAvailable;
  }

  set isAvailable(value: boolean) {
    this._isAvailable = value;
  }
}
