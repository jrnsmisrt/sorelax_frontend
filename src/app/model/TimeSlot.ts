export class TimeSlot {

  private _id!: string;
  private _customerId!: string;
  private _date!: string;
  private _time!: string;
  private _isAvailable: boolean = true;
  private _confirmed: boolean = false;

  constructor(date: string, time: string) {
    this.date = date;
    this.time = time;
  }

  confirmAvailability() {
    this._isAvailable = !this._confirmed;
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

  get date(): string {
    return this._date;
  }

  set date(value: string) {
    this._date = value;
  }

  get time(): string {
    return this._time;
  }

  set time(value: string) {
    this._time = value;
  }

  get isAvailable(): boolean {
    return this._isAvailable;
  }

  set isAvailable(value: boolean) {
    this._isAvailable = value;
  }


  get confirmed(): boolean {
    return this._confirmed;
  }

  set confirmed(value: boolean) {
    this._confirmed = value;
  }
}
