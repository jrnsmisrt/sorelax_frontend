import {Injectable, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {Observable, of, Subject, switchMap, takeUntil} from "rxjs";
import {User} from "../model/User";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {getAuth, onAuthStateChanged, signInWithPopup} from "@angular/fire/auth";
import firebase from "firebase/compat/app";
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import auth = firebase.auth;

declare let gapi: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  userLoggedIn!: boolean;
  user$: Observable<User> | any;
  authState: any = null;
  calendarItems!: any[];
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
    this.afAuth.authState.pipe(takeUntil(this.destroy$)).subscribe(authState => {
      this.authState = authState;
    });
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

  async loginWithGoogle() {
    const googleAuth = gapi.auth2.getAuthInstance();
    const googleUser = await googleAuth.signIn();

    const token = googleUser.getAuthResponse().id_token;

    const credential = auth.GoogleAuthProvider.credential(token);

    await this.afAuth.signInAndRetrieveDataWithCredential(credential).then(async (u) => {

        await this.fireStore.collection<User>('users').doc(u.user?.uid).set({
          address: {city: "", country: "", houseNumber: "", postBox: "", postalCode: "", street: ""},
          dateOfBirth: "",
          firstName: "",
          id: "",
          lastName: "",
          phoneNumber: "",
          status: "",
          role: 'admin',
          // @ts-ignore
          email: u.user?.email
        }).catch((err) => {
          console.log(err);
        })

      }
    );


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

  async signInWithGoogle() {
    let provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
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
