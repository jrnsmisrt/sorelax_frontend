import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import {Observable, of, switchMap} from "rxjs";
import {User} from "../user/model/User";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import firebase from 'firebase/compat/app';
import Firestore = firebase.firestore.Firestore;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userLoggedIn: boolean;
  user$: Observable<User> | any;


  constructor(private router: Router, private db: Firestore, private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.userLoggedIn = false;

    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.userLoggedIn = true;
      }
     else {
        this.userLoggedIn = false;
      }
    });


    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    )

  }

 /* async googleSignin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }*/

  /* private updateUserData(user:any) {
     const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

     const data = {
       uid: user.uid,
       email: user.email,
       firstName: user.firstName,
       lastName: user.lastName,
       displayName: user.firstName+' '+user.lastName,
       dateOfBirth: user.dateOfBirth,
       phoneNumber: user.phoneNumber,
       address: user.address,
       role: user.role
     }
     return userRef.set(data, {merge: true})

   }
   */

  async signOut() {
    await this.afAuth.signOut();
    this.router.navigate(['/']);
  }


  /* signupUser(user: any): Promise<any> {
     return this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
       .then((result) => {
         let emailLower = user.email.toLowerCase();
         result.user!.sendEmailVerification();
       })
       .catch(error => {
         console.log('Auth Service: signup error', error);
         if (error.code)
           return {isValid: false, message: error.message};
       });
   }*/

  loginUser(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('Auth Service: loginUser: success');
        this.router.navigate(['/dashboard']);
      })
      .catch(error => {
        console.log('Auth Service: login error...');
        console.log('error code', error.code);
        console.log('error', error);
        if (error.code)
          return {isValid: false, message: error.message};
      });
  }


}
