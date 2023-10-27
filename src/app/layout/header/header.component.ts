import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthService} from "../../services/auth.service";
import {User} from "../../model/User";
import {UserService} from "../../services/user.service";
import {Observable, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  user!: Observable<User> | undefined;
  user$!: Observable<User | undefined>;
  isAdmin!: boolean;
  private destroy$ = new Subject();

  constructor(public afAuthService: AuthService, public afAuth: AngularFireAuth,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.user = this.afAuthService.user$;
    this.user$ = this.userService.user;
    //this.isAdmin = this.userService.isAdmin;
    this.setAdmin();
  }

  logout(): void {
    this.afAuthService.signOut().then(() => {
      if (!this.afAuthService.isUserSignedIn()) {
        M.toast({html: `Succesfully logged out!`, classes: 'rounded teal'})
      } else {
        M.toast({html: `Oops! Something went wrong, please try again.`, classes: 'rounded teal'})
      }
    })
  }

  setAdmin() {
    this.afAuth.user.pipe(takeUntil(this.destroy$)).subscribe((x) => {
      this.userService.getUser(x?.uid).pipe(takeUntil(this.destroy$))
        .subscribe((y) => {
          this.isAdmin = (y?.role === 'admin');
        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
