import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {User} from "../model/User";
import {Observable} from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userId!: string;
  currentUser!: Observable<unknown[]>;
  users: Observable<User[]> = this.userService.allUsers;

  constructor(private afAuth: AuthService, private userService: UserService, private router: Router) {
    this.userId = afAuth.authState.uid;
  }

  ngOnInit(): void {
    if (!this.afAuth.userLoggedIn) {
      this.router.navigate(['/home']);
    }
    console.log(this.userService.funky());
  }


}
