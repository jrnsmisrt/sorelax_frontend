import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import firebase from "firebase/compat";
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import {getAuth, signInWithPopup} from "@angular/fire/auth";


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
              private formBuilder: FormBuilder
              ) {
    this.firebaseErrorMessage = '';
  }

  ngOnInit(): void {
  }

  loginUser() {
    if (this.loginForm.invalid)
      return;

    this.auth.loginUser(this.loginForm.value.email, this.loginForm.value.password).then((result) => {
      if (result == null) {
        console.log('logging in...');
        M.toast({html:`Logging in...`});
        M.toast({html:`Succesfully logged in!`});
        this.router.navigate([`users/${this.auth.getUserUid()}/dashboard`]);
      }
      else if (result.isValid == false) {
        console.log('login error', result);
        this.firebaseErrorMessage = result.message;
      }
    });
  }

  signInWithGoogle(){
    this.auth.signInWithGoogle().then(()=>{
      if(this.auth.isUserSignedIn()){
        M.toast({html:`Succesfully signed in with Google!`});
        this.router.navigate([`users/${this.auth.getUserUid()}/dashboard`]);
      }
      else{
        M.toast({html:'Sign in was unsuccessful please try again'})
      }

    });
  }


}
