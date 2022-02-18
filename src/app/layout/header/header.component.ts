import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthService} from "../../services/auth.service";
import {User} from "../../model/User";
import {UserService} from "../../services/user.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user!: Observable<User | any>;
  user$ : Observable<User | undefined>
  constructor(public afAuthService: AuthService, public afAuth: AngularFireAuth, private userService: UserService) {
    this.user = afAuthService.user$;
    this.user$ = userService.user;
  }

  ngOnInit(): void {
    $( document ).ready(function(){
    $(".dropdown-trigger").dropdown();
    })
  }

  logout(): void {
    this.afAuthService.signOut().then(() => {
      if (!this.afAuthService.isUserSignedIn()) {
        M.toast({html: `Succesfully logged out!`})
      }
      else{
        M.toast({html:`Oops! Something went wrong, please try again.`})
      }
    })
  }
}
