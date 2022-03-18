import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthService} from "../../services/auth.service";
import {User} from "../../model/User";
import {UserService} from "../../services/user.service";
import {Observable} from "rxjs";
import {InitService} from "../../materialize/init.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  user!: Observable<User | any>;
  user$: Observable<User | undefined>
  isAdmin!: boolean;

  constructor(public afAuthService: AuthService, public afAuth: AngularFireAuth,
              private userService: UserService, private init: InitService) {
    this.user = this.afAuthService.user$;
    this.user$ = this.userService.user;
    this.isAdmin = userService.isAdmin;
    this.setAdmin();
  }

  ngOnInit(): void {
    this.init.initDropdown();
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
    this.user.subscribe((user) => {
      if (user?.role === 'admin') {
        this.isAdmin = true;
      } else {
        this.isAdmin = false
      }
    })
  }
}
