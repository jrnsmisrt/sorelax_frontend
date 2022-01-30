import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Observable} from "rxjs";
import {User} from "../model/User";


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private afDataBase: AngularFireDatabase) {

  }

  getRealtimeDbUsers():Observable<any>{
    return this.afDataBase
      .list<User>('users')
      .valueChanges();
  }

  addUser(user: User){
    let currentTime = Number(new Date());
    this.afDataBase.list<User>('users').push(user);
    this.afDataBase.object('users')
      .update({'last_updated_at': currentTime});
  }
}
