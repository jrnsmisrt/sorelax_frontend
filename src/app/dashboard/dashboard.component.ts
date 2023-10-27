import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {User} from "../model/User";
import {Observable, Subject, Subscription, takeUntil} from "rxjs";
import {DocumentData} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  userId: string | undefined;
  currentUser!: Subscription;
  users: Observable<User[]> = this.userService.allUsers;
  userdata!: DocumentData;
  name!: string;
  private destroy$ = new Subject();

  constructor(private afAuth: AuthService, public userService: UserService, private router: Router) {
    this.userId = this.afAuth.getUserUid();
    this.userdata = this.userService.allUsers.pipe(takeUntil(this.destroy$));

    this.currentUser = this.userService.user.pipe(takeUntil(this.destroy$)).subscribe(a => {
      this.name = `${a.firstName} ${a.lastName};`
    });
  }

  ngOnInit(): void {
    if (!this.afAuth.userLoggedIn) {
      this.router.navigate(['/home']).finally();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
