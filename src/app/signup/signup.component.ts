import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
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
    'address': this.formBuilder.group({
      'street': new FormControl('', [Validators.required]),
      'houseNumber': new FormControl('', [Validators.required, Validators.min(1)]),
      'postBox': new FormControl(''),
      'postalCode': new FormControl('', [Validators.required]),
      'city': new FormControl('', [Validators.required, Validators.maxLength(30)]),
      'country': new FormControl('', [Validators.required, Validators.maxLength(30)])
    }),
    'role': new FormControl('')
  });

  firebaseErrorMessage: string;


  constructor(private formBuilder: FormBuilder, private afAuth: AngularFireAuth,
              private fireStore: AngularFirestore, private router: Router,
  ) {
    this.firebaseErrorMessage = '';
  }

  ngOnInit(): void {
    document.addEventListener('DOMContentLoaded', function () {
      var elems = document.querySelectorAll('.modal');
      var instances = M.Modal.init(elems, {
        dismissible: true,
      });
    });

    $(document).ready(() => {
      $('.datepicker').datepicker({
        format: "dd/mm/yyyy",
        yearRange: [1900, new Date().getFullYear() - 18],
        defaultDate: new Date(1989, new Date().getMonth(), new Date().getDay()),
        maxDate: new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDay() - 1),
        onSelect: () => {
          this.signupForm.patchValue({
            dateOfBirth: this
          })
        }
      });
    });

  }

  signupUser() {
    return this.afAuth.createUserWithEmailAndPassword(this.signupForm.get('email')?.value, this.signupForm.get('password')?.value)
      .then((result) => {
        result.user!.sendEmailVerification();
        return this.fireStore.collection('users').doc(result.user?.uid).set({
          id: result.user?.uid,
          firstName: this.signupForm.get(['firstName'])?.value,
          lastName: this.signupForm.get(['lastName'])?.value,
          dateOfBirth: this.signupForm.get(['dateOfBirth'])?.value,
          email: this.signupForm.get(['email'])?.value,
          phoneNumber: this.signupForm.get(['phoneNumber'])?.value,
          address: this.signupForm.get(['address'])?.value,
          role: 'customer',
        });
      }).then(() => {
        this.signupForm.reset();
      })
      .catch(error => {
        console.log('Auth Service: signup error', error);
        if (error.code)
          return {isValid: false, message: error.message};
      });
  }

  onSubmit() {
    console.log('click submit');
    this.signupForm.patchValue({
      dateOfBirth: $('.datepicker').val()
    })
    console.log(this.signupForm.get('dateOfBirth')?.value);
    this.signupForm.markAllAsTouched();

    if (this.signupForm.invalid) {
      M.toast({html: 'Oops! Think you forgot a field or did not use valid input', classes: 'rounded teal'});
    } else {

      this.signupUser()!.then(() => {
        M.toast({html: `Sign up has been succesful!`, classes: 'rounded teal'});
        this.router.navigate(['/login']);
      });
    }
  }

  clear() {
    this.signupForm.reset();
    M.toast({html: 'form has been cleared', classes: 'rounded teal'});
  }

  get firstName() {
    return this.signupForm.get('firstName');
  }

  get lastName() {
    return this.signupForm.get('lastName');
  }

  get dateOfBirth() {
    return this.signupForm.get('dateOfBirth');
  }

  get phoneNumber() {
    return this.signupForm.get('phoneNumber');
  }

  get street() {
    return this.signupForm.get('address.street');
  }

  get houseNr() {
    return this.signupForm.get('address.houseNumber');
  }

  get postalCode() {
    return this.signupForm.get('address.postalCode');
  }

  get city() {
    return this.signupForm.get('address.city');
  }

  get country() {
    return this.signupForm.get('address.country');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get passWord() {
    return this.signupForm.get('password');
  }
}
