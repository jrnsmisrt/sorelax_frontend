import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../../model/User";
import {UserService} from "../../services/user.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-users-overview',
  templateUrl: './users-overview.component.html',
  styleUrls: ['./users-overview.component.css']
})
export class UsersOverviewComponent implements OnInit {
  users!: Observable<User[]>;
  user!: Observable<User | undefined>;


  constructor(private userService: UserService, private fireStore:AngularFirestore) {
    this.users = this.fireStore.collection<User>('users',ref => ref.orderBy('lastName','asc').orderBy('firstName', 'asc')).valueChanges();
  }

  ngOnInit(): void {
    $(document).ready(function () {
      $('.modal').modal();
    });
  }

  openUserOverViewModal(userId: string){
    this.user = this.fireStore.collection<User>('users').doc(userId).valueChanges()
    M.Modal.getInstance(document.getElementById('userOverViewModal')!).open();
  }


}
