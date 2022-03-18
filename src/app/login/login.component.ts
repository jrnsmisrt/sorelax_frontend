import {Component} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent {
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

  loginUser() {
    if (this.loginForm.invalid)
      return;

    this.auth.loginUser(this.loginForm.value.email, this.loginForm.value.password).then((result) => {
      if (result == null) {
        M.toast({html: `Logging in...`, classes: 'rounded teal'});
        M.toast({html: `Succesfully logged in!`, classes: 'rounded teal'});
        this.router.navigate([`users/${this.auth.getUserUid()}/profile`]);
      } else if (result.isValid == false) {
        console.log('login error', result);
        this.firebaseErrorMessage = result.message;
      }
    });
  }

  signInWithGoogle() {
    this.auth.signInWithGoogle().then(() => {
      if (this.auth.isUserSignedIn()) {
        M.toast({html: `Succesfully signed in with Google!`, classes: 'rounded teal'});
        this.router.navigate([`users/${this.auth.getUserUid()}/profile`]);
      } else {
        M.toast({html: 'Sign in was unsuccessful please try again', classes: 'rounded teal'})
      }
    });
  }

}
