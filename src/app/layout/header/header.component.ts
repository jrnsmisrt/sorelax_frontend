import { Component, OnInit } from '@angular/core';
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
  constructor(public afAuth: AngularFireAuth, private afAuthService: AuthService) {
    this.user = afAuthService.user$;
  }

  ngOnInit(): void {
  }
  logout():void{
    this.afAuth.signOut().then(()=>{
      M.toast({html:`Succesfully logged out!`});

    });
  }
}
