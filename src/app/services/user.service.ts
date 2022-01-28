import { Injectable } from '@angular/core';
import {DatabaseService} from "./database.service";
import {User} from "../user/model/User";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  allUsers!: Observable<User>;
  constructor(private databaseService: DatabaseService) {
    this.allUsers = databaseService.getRealtimeDbUsers();
  }

  addUser(user: User){
    this.databaseService.addUser(user);
  }

}
