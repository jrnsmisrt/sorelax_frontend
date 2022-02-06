import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private fireStore: AngularFirestore) { }

  getFirstName(uid: string){
    return this.fireStore.firestore.doc(`users/${uid}`).get();
  }
}
