import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {User} from "../model/User";
import {Observable, Subscription} from "rxjs";
import {FirestoreService} from "../services/firestore.service";
import firebase from "firebase/compat";
import DocumentData = firebase.firestore.DocumentData;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userId: string | undefined;
  currentUser!: Subscription;
  users: Observable<User[]> = this.userService.allUsers;
  userdata!: DocumentData;
  name!:string;
  constructor(private afAuth: AuthService, public userService: UserService, private fireStore: FirestoreService,private router: Router) {
    this.userId = this.afAuth.getUserUid();
    this.userdata=this.userService.allUsers;

    this.currentUser=this.userService.user.subscribe(a=>{
      this.name=`${a.firstName} ${a.lastName};`
    });

  }

  ngOnInit(): void {
    if (!this.afAuth.userLoggedIn) {
      this.router.navigate(['/home']);
    }

  }


}
