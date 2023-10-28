import {Injectable, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {Observable, of, Subject, switchMap, takeUntil} from "rxjs";
import {User} from "../model/User";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {getAuth, onAuthStateChanged} from "@angular/fire/auth";
import firebase from "firebase/compat/app";

declare let gapi: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  userLoggedIn!: boolean;
  user$: Observable<User> | any;
  authState: Observable<firebase.User | null>;
  calendarId = 'sofieverkouille@gmail.com';
  private destroy$ = new Subject();

  constructor(private router: Router,
              private afAuth: AngularFireAuth,
              private fireStore: AngularFirestore,
  ) {
    onAuthStateChanged(getAuth(), (user) => {
      this.userLoggedIn = !!user;
      this.initClient();
    });

    this.authState = this.afAuth.authState;

    this.addUserToFireStore();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  //initialize google api
  initClient() {
    gapi.load('client', () => {
      gapi.client.init({
        apiKey: 'AIzaSyCbmaY4uOWxP0OWglx9k04EBXdsQOcXRxk',
        clientId: '416230477435-41f0n1atdfc278fba9n0qls0q7o37bg9.apps.googleusercontent.com',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar'
      })
      gapi.client.load('calendar', 'v3');
    })
  }

  async insertEvent(startDateTime: Date, endDateTime: Date, description: string, summary: string) {
    await gapi.client.calendar.events.insert({
      calendarId: this.calendarId,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Europe/Brussels'
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Europe/Brussels'
      },
      summary: summary,
      description: description
    }).then(() => {
      M.toast({html: 'boeking toegevoegd aan agenda', classes: 'rounded teal'})
    }).catch((error: Error) => {
      M.toast({html: `Er liep iets fout: ${error}`, classes: 'rounded red'});
    })
  }

  private addUserToFireStore() {
    this.user$ = this.afAuth.authState.pipe(takeUntil(this.destroy$),
      switchMap(user => {
        if (user) {
          return this.fireStore.doc<User>(`users/${user.uid}`).valueChanges().pipe(takeUntil(this.destroy$));
        } else {
          return of(null);
        }
      }));
  }

  async loginUser(email: string, password: string): Promise<any> {

    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(async () => {
        this.userLoggedIn = true;

      })
      .catch(error => {
        console.error('error', error);
        this.userLoggedIn = false;
        if (error.code)
          return {isValid: false, message: error.message};
      });
  }

  async signOut() {
    await this.afAuth.signOut();
    await this.router.navigate(['/']);
  }

  isUserSignedIn() {
    return !!getAuth().currentUser;
  }

  getUserUid() {
    return getAuth().currentUser?.uid;
  }
}
