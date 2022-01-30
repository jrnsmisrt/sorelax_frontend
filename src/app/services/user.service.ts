import { Injectable } from '@angular/core';
import {DatabaseService} from "./database.service";
import {User} from "../model/User";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  allUsers!: Observable<User>;
  constructor(private databaseService: DatabaseService) {
    this.allUsers = databaseService.getRealtimeDbUsers();
  }


}
