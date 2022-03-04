import {Pipe, PipeTransform} from '@angular/core';
import {Booking} from "../model/Booking";

@Pipe({
  name: 'filterStatus'
})
export class FilterStatus implements PipeTransform {

  transform(statusArray: Booking[] | null, statusFilter: string): Booking[] | null {
    if (statusFilter === undefined ||
      statusArray === null ||
      statusFilter === null) {
      return statusArray;
    }
    return statusArray.filter((b) => {
      return b.status.includes(statusFilter);
    });
  }

}
