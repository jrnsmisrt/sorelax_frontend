import {Component, OnInit} from '@angular/core';
import {collection, Firestore, getFirestore, getDocs, orderBy, query, onSnapshot,} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {User} from "../../model/User";
import {UserService} from "../../services/user.service";
import {snapshotChanges} from "@angular/fire/compat/database";

@Component({
  selector: 'app-users-overview',
  templateUrl: './users-overview.component.html',
  styleUrls: ['./users-overview.component.css']
})
export class UsersOverviewComponent implements OnInit {
  db = getFirestore();
  colRef = collection(this.db, 'users');
  users: Observable<User[]> = this.userService.allUsers;


  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.getAllUsers().then(()=>M.toast({html:'Viewing all users'}));
  }

  async getAllUsers(){
    let q = query(collection(this.db, 'users'), orderBy('lastname', 'asc'));
    onSnapshot(q, snaps =>{
      document.querySelector('#allusers')!.innerHTML = '';
      snaps.forEach(doc=>{
        const entry = document.createElement('p');
        entry.textContent = doc.data()['firstname']+' '+ doc.data()['lastname'];
        document.querySelector('#allusers')!.appendChild(entry);
      })
    });
  }

}
