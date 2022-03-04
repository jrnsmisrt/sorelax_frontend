import {Pipe, PipeTransform} from '@angular/core';
import {Booking} from "../model/Booking";

@Pipe({
  name: 'filterDate'
})
export class FilterDate implements PipeTransform {

  transform(dateArray: Booking[] | null, dateFilter: string): Booking[] | null {
    if (dateFilter === undefined ||
      dateArray === null ||
      dateFilter === null) {
      return dateArray;
    }
    return dateArray.filter((b) => {
      return b.date.includes(dateFilter.trim());
    });
  }

}
