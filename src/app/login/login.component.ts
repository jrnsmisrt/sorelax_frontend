import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {InitService} from "../materialize/init.service";
import {BehaviorSubject} from "rxjs";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent implements OnInit {
  loginForm = this.formBuilder.group({
    'email': new FormControl('', [Validators.required, Validators.email]),
    'password': new FormControl('', Validators.required)
  });

  firebaseErrorMessage: string;
  _enableReset$ = new BehaviorSubject<boolean>(false);
  resetPassword = this.formBuilder.group({
    'email': new FormControl('', [Validators.required, Validators.email])
  });
  resetEmail = '';

  constructor(public auth: AuthService,
              private router: Router,
              private initService: InitService,
              private formBuilder: FormBuilder
  ) {
    this.firebaseErrorMessage = '';
  }

  ngOnInit() {
    this.initService.initModal();
  }

  loginUser() {
    if (this.loginForm.invalid) {
      return;
    }

    this.auth.loginUser(this.loginForm.value.email, this.loginForm.value.password).then(async (result) => {
      if (result == null) {
        M.toast({html: `Logging in...`, classes: 'rounded teal'});
        M.toast({html: `Succesfully logged in!`, classes: 'rounded teal'});

        if (this.loginForm.value.email === 'info@sorelax.be') {
          this.loginWithGoogle();
        }


        await this.router.navigate([`users/${this.auth.getUserUid()}/profile`]);
      } else if (result.isValid == false) {
        console.log('login error', result);
        this.firebaseErrorMessage = result.message;
      }
    });
  }

  private loginWithGoogle() {
    M.Modal.getInstance(document.querySelector('#googleSignIn')!).open();
  }

  resetPw(email: string) {
    this.resetPassword.markAllAsTouched();

    if (this.resetPassword.valid) {
      this.auth.resetPassword(email);
    }
  }

  enableReset() {
    this._enableReset$.next(!this._enableReset$.value);
  }
}
