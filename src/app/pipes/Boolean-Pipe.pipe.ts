import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'availability'})
export class AvailabilityPipe implements PipeTransform {
  transform(value: boolean): string {
    if(value) return 'Available';
    else return 'Not Available';
  }
}
