import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {UserService} from "../services/user.service";
import {FirebaseService} from "../services/firebase.service";
import {first} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = this.formBuilder.group({
    'email': new FormControl('', [Validators.required, Validators.email]),
    'password': new FormControl('', Validators.required)
  });

  firebaseErrorMessage: string;

  constructor(public auth: AuthService, private router: Router,
              private afAuth: AngularFireAuth,
              private formBuilder: FormBuilder,
              private afDb: AngularFirestore) {
    this.firebaseErrorMessage = '';
  }

  ngOnInit(): void {
  }

  loginUser() {
    let loggedInUser =this.afAuth.authState.pipe(first()).toPromise();
    if (this.loginForm.invalid)
      return;

    this.auth.loginUser(this.loginForm.value.email, this.loginForm.value.password).then((result) => {
      if (result == null) {
        console.log('logging in...');
        M.toast({html:`Succesfully logged in!`});
        this.router.navigate(['/dashboard']);
      }
      else if (result.isValid == false) {
        console.log('login error', result);
        this.firebaseErrorMessage = result.message;
      }
    });
  }

}
