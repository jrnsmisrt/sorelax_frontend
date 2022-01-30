export interface Booking{
  uid: string,
  userUid: string,
  date: string,
  time: string,
  massage: string,
  duration: number,
  personalMessage: string
  requestedOn: string,
  status: string, //pending, confirmed, denied, cancelled, removed(softdelete)
}
