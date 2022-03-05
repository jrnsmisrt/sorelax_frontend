import {Injectable} from '@angular/core';
import {User} from "../model/User";
import {Observable, Subscription} from "rxjs";
import {AuthService} from "./auth.service";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentData
} from '@angular/fire/compat/firestore';
import {FirestoreService} from "./firestore.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  userCollection!: AngularFirestoreCollection<User>;
  allUsers!: Observable<User[]>;
  userData!: DocumentData;
  userDoc!: AngularFirestoreDocument;
  user!: Observable<User>;
  userRole!: string | undefined;
  isAdmin!: boolean;


  constructor(private fireStore: AngularFirestore, private fireAuth: AngularFireAuth, private firestoreService: FirestoreService, private afAuth: AuthService) {
    this.userCollection = fireStore.collection<User>('users', ref => ref.orderBy('lastName', 'asc')
      .orderBy('firstName', 'asc')
      .orderBy('dateOfBirth', 'asc'));
    this.allUsers = this.userCollection.valueChanges({idField: 'uid'});

    this.userDoc = fireStore.doc<User>(`users/${afAuth.getUserUid()}`);
    // @ts-ignore
  }

  getAllUsers(): Observable<User[]> {
    return this.userCollection.valueChanges();
  }

  getUser(uid: string | undefined): Observable<User | undefined> {
    let getUserDoc = this.fireStore.doc<User>(`users/${uid}`);
    return getUserDoc.valueChanges();
  }

  getUserFirstName(uid: string): Subscription {
    let userFullName: string | undefined;
    return this.getUser(uid).subscribe((user) => {
      userFullName = user?.firstName + ' ' + user?.lastName!;
      console.log(userFullName.toString());
      return userFullName.toString();
    });
  }


}
