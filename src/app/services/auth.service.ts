import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {Observable, of, switchMap} from "rxjs";
import {User} from "../model/User";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userLoggedIn!: boolean;
  user$: Observable<User> | any;


  constructor(private router: Router, private afAuth: AngularFireAuth, private angularFirestore: AngularFirestore) {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.userLoggedIn = true;
      } else {
        this.userLoggedIn = false;
      }
    });


    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.angularFirestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    )
  }

  async signOut() {
    await this.afAuth.signOut();
    this.router.navigate(['/']);
  }

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
