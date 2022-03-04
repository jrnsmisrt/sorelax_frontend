import { Pipe, PipeTransform } from '@angular/core';
import {User} from "../model/User";

@Pipe({
  name: 'filterUserName'
})
export class FilterUserName implements PipeTransform {

  transform(userArray: User[] | null, nameFilter: string):  User[] | null {

    if (nameFilter === undefined ||
      userArray === null ||
      nameFilter === null) {
      return userArray;
    }

    return  userArray
      .filter(
        (user) => user.firstName?.trim().toLocaleLowerCase().includes(nameFilter.trim().toLocaleLowerCase()) ||
          user.lastName?.trim().toLocaleLowerCase().includes(nameFilter.trim().toLocaleLowerCase())
      );
  }

}
