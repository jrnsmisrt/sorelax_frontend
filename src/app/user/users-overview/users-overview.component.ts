import {Component, OnInit} from '@angular/core';
import {collection, Firestore, getFirestore, getDocs, orderBy, query, onSnapshot,} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {User} from "../../model/User";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-users-overview',
  templateUrl: './users-overview.component.html',
  styleUrls: ['./users-overview.component.css']
})
export class UsersOverviewComponent implements OnInit {
  db = getFirestore();
  colRef = collection(this.db, 'users');
  users: Observable<User[]> = this.userService.allUsers;


  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
  }



}
