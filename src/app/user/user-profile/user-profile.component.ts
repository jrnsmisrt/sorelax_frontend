import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {Observable} from "rxjs";
import {User} from "../../model/User";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profileId = this.route.snapshot.paramMap.get('id');
  user!:Observable<User|undefined>;
  userId!:string | null;
  userFirstName!:string|undefined;
  userLastName!:string|undefined;
  userEmail!:string|undefined;
  userDateOfBirth!:string|undefined;
  userAddress!:{ street: string; houseNumber: string; postBox: string; postalCode: string; city: string; country: string };
  userPhoneNumber!:string|undefined;
  userRole!:string|undefined;

  constructor(private userService: UserService, private route: ActivatedRoute) {
    this.user = this.userService.getUser(this.profileId!);
    this.setUser();

  }

  ngOnInit(): void {
  }

  setUser(){
    this.user.subscribe((user)=>{
      this.userId=this.route.snapshot.paramMap.get('id');
      this.userFirstName=user!.firstName;
      this.userLastName=user!.lastName;
      this.userEmail=user!.email;
      this.userPhoneNumber=user!.phoneNumber
      this.userDateOfBirth=user!.dateOfBirth;
      this.userAddress=user!.address;
      this.userRole=user!.role;
    })
  }

}
