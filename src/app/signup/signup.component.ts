import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {DatabaseService} from "../services/database.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  currentUserUid!: string;
  signupEmailPasswordForm = this.formBuilder.group({
    'email': new FormControl('', [Validators.required, Validators.email]),
    'password': new FormControl('', Validators.required)
  });

  signupForm = this.formBuilder.group({
    'email': new FormControl('', [Validators.required, Validators.email]),
    'password': new FormControl('', Validators.required),
    'firstName': new FormControl('', [Validators.required]),
    'lastName': new FormControl('', [Validators.required]),
    'dateOfBirth': new FormControl('', [Validators.required]),
    'phoneNumber': new FormControl('', [Validators.required]),
    'address': new FormControl('', [Validators.required]),
    'role': new FormControl('', [Validators.required])
  });

  firebaseErrorMessage: string;


  constructor(private authService: AuthService, private router: Router,
              private afAuth: AngularFireAuth, private databaseService: DatabaseService,
              private formBuilder: FormBuilder) {
    this.firebaseErrorMessage = '';


  }

  ngOnInit(): void {

  }

  signup() {
    // if (this.signupForm.invalid||this.signupEmailPasswordForm.invalid)                            // if there's an error in the form, don't submit it
    //   return;

    this.authService.signupUser(this.signupForm.value).then((result) => {
      if (result == null)                                 // null is success, false means there was an error
        this.router.navigate(['/dashboard']);
      else if (result.isValid == false)
        this.firebaseErrorMessage = result.message;
    }).catch(() => {
    });
    console.log(this.signupForm.get('id'));
    this.databaseService.addUser(this.signupForm.value);
  }


}
