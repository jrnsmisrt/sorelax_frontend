import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'booleanToText'})
export class BooleanPipe implements PipeTransform {
  transform(value: boolean): string {
    if(value) return 'Available';
    else return 'Not Available';
  }
}
