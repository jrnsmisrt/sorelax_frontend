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
  currentUserRole!: string|undefined;


  constructor(private fireStore: AngularFirestore, private fireAuth: AngularFireAuth, private firestoreService: FirestoreService, private afAuth: AuthService) {
    this.userCollection = fireStore.collection<User>('users', ref => ref.orderBy('lastName', 'asc')
      .orderBy('firstName', 'asc')
      .orderBy('dateOfBirth', 'asc'));
    this.allUsers = this.userCollection.valueChanges({idField: 'uid'});

    this.userDoc = fireStore.doc<User>(`users/${afAuth.getUserUid()}`);
    // @ts-ignore
  }

  async setCurrentUserRole(id: string){
    await this.fireStore.collection<User>('users').doc(id).valueChanges().subscribe((u)=>{
      this.currentUserRole = u?.role;
    })
  }

  async getCurrentUserRole():Promise<string | undefined>{
    return this.currentUserRole;
  }

  getAllUsers(): Observable<User[]> {
    return this.userCollection.valueChanges();
  }

  getUser(uid: string | undefined): Observable<User | undefined> {
    return this.fireStore.collection<User>('users').doc(uid).valueChanges();
  }

  getUserFirstName(uid: string): Subscription {
    let userFullName: string | undefined;
    return this.getUser(uid).subscribe((user) => {
      userFullName = user?.firstName + ' ' + user?.lastName!;
      return userFullName.toString();
    });
  }


}
