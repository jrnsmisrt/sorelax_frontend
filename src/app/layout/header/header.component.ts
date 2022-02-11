import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthService} from "../../services/auth.service";
import {User} from "../../model/User";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user!: User;

  constructor(public afAuthService: AuthService, public afAuth: AngularFireAuth) {
    this.user = afAuthService.user$;
  }

  ngOnInit(): void {
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
