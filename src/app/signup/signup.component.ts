import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  currentUserUid!: string;

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


  constructor(private formBuilder: FormBuilder, private afAuth: AngularFireAuth, private afDb: AngularFirestore) {
    this.firebaseErrorMessage = '';
  }

  ngOnInit(): void {

  }

  signupUser(){
    return this.afAuth.createUserWithEmailAndPassword(this.signupForm.get('email')?.value, this.signupForm.get('password')?.value)
      .then((result) => {
        result.user!.sendEmailVerification();
        return this.afDb.collection('users').doc(result.user?.uid).set({
          firstName: this.signupForm.get(['firstName'])?.value,
          lastName: this.signupForm.get(['lastName'])?.value,
          dateOfBirth: this.signupForm.get(['dateOfBirth'])?.value,
          phoneNumber: this.signupForm.get(['phoneNumber'])?.value,
          address: this.signupForm.get(['address'])?.value,
          role: 'customer',
        });
      }).then(()=>{
        this.signupForm.reset();
      })
      .catch(error => {
        console.log('Auth Service: signup error', error);
        if (error.code)
          return {isValid: false, message: error.message};
      });
  }
}
