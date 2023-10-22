import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../../model/User";
import {UserService} from "../../services/user.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {InitService} from "../../materialize/init.service";

@Component({
  selector: 'app-users-overview',
  templateUrl: './users-overview.component.html',
})

export class UsersOverviewComponent implements OnInit {
  users!: Observable<User[]>;
  user!: Observable<User | undefined>;

  constructor(private userService: UserService, private fireStore:AngularFirestore,
              private init: InitService) {
  }

  ngOnInit(): void {
    this.users = this.fireStore.collection<User>('users',ref =>
      ref.orderBy('lastName','asc').orderBy('firstName', 'asc')).valueChanges();

    this.init.initModal();
  }

  openUserOverViewModal(userId: string){
    this.user = this.fireStore.collection<User>('users').doc(userId).valueChanges();

    M.Modal.getInstance(document.getElementById('userOverViewModal')!).open();
  }
}
