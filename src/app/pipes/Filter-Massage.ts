import { Pipe, PipeTransform } from '@angular/core';
import {Booking} from "../model/Booking";

@Pipe({
  name: 'filterMassage'
})
export class FilterMassage implements PipeTransform {

  transform(bookingArray: Booking[] | null, massageFilter: string):  Booking[] | null {

    if (massageFilter === undefined ||
      bookingArray === null ||
      massageFilter === null) {
      return bookingArray;
    }

    return  bookingArray
      .filter(
        (booking) => booking.massage?.trim().toLocaleLowerCase().includes(massageFilter.trim().toLocaleLowerCase())
      );
  }

}
