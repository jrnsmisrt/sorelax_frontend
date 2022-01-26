import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private afAuth: AuthService, private router: Router) { }

  ngOnInit(): void {
    if(!this.afAuth.userLoggedIn){
      this.router.navigate(['/home']);
    }
  }



}
