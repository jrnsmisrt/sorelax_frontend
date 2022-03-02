import {Component, OnInit} from '@angular/core';
import {collection, Firestore, getFirestore, getDocs, orderBy, query, onSnapshot,} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {User} from "../../model/User";
import {UserService} from "../../services/user.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-users-overview',
  templateUrl: './users-overview.component.html',
  styleUrls: ['./users-overview.component.css']
})
export class UsersOverviewComponent implements OnInit {
  users!: Observable<User[]>;


  constructor(private userService: UserService, private fireStore:AngularFirestore) {
    this.users = this.fireStore.collection<User>('users').valueChanges();
  }

  ngOnInit(): void {
  }



}
