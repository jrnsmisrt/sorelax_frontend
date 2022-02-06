import {Injectable} from '@angular/core';
import {User} from "../model/User";
import {Observable, Subscription} from "rxjs";
import {AuthService} from "./auth.service";
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {doc} from "@angular/fire/firestore";
import {FirestoreService} from "./firestore.service";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  userCollection!: AngularFirestoreCollection<User>;
  allUsers!: Observable<User[]>;
  currentUser!: Observable<User>;
  currentUserFirstName!: string;
  bla!: Subscription;

  constructor(private fireStore: AngularFirestore, private firestoreService: FirestoreService, private afAuth: AuthService) {
    this.userCollection = fireStore.collection<User>('users');
    this.allUsers = this.userCollection.valueChanges({idField: 'uid'});

  }





}
