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
import firebase from "firebase/compat";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  userCollection!: AngularFirestoreCollection<User>;
  allUsers!: Observable<User[]>;
  userData!: DocumentData;
  userDoc!: AngularFirestoreDocument;
  user!: Observable<User>;
  userRole!:string | undefined;

  constructor(private fireStore: AngularFirestore, private firestoreService: FirestoreService, private afAuth: AuthService) {
    this.userCollection = fireStore.collection<User>('users');
    this.allUsers = this.userCollection.valueChanges({idField: 'uid'});

    this.userDoc = fireStore.doc<User>(`users/${afAuth.getUserUid()}`);
    // @ts-ignore
    this.user = this.userDoc.valueChanges();
    this.user.subscribe((user)=>{
      this.userRole = user.role;
    });

  }


  getAllUsers():Observable<User[]> {
   return this.userCollection.valueChanges();
  }

  getUser(uid:string):Observable<User|undefined>{
    let getUserDoc = this.fireStore.doc<User>(`users/${uid}`);
    return getUserDoc.valueChanges();
  }


}
