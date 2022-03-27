export interface Booking{
  id: string,
  userUid?: string,
  date: string,
  time: string,
  massage: string,
  duration: number,
  personalMessage: string
  requestedOn: string,
  timeslot: string,
  status: string, //pending, confirmed, denied, cancelled, removed(softdelete)
  preferredHour: string,
  preferredMinute: string,
  preferredTime: string,
}
