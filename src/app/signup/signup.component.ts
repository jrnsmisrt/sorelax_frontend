import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Cities, Countries} from "countries-states-cities-service/lib/src"
import {Router} from "@angular/router";
import {InitService} from "../materialize/init.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})

export class SignupComponent implements OnInit {
  currentUserUid!: string;
  countries!: any[];
  cities!: any[];
  countrySelect: any;
  countryCode: string = 'BE';
  citySelect: any;


  signupForm = this.formBuilder.group({
    'email': ['', [Validators.required, Validators.pattern('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])'), Validators.email]],
    'password': ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]],
    'firstName': ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
    'lastName': ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
    'dateOfBirth': ['', [Validators.required]],
    'phoneNumber': ['', [Validators.required, Validators.minLength(6), Validators.pattern('^[0-9]*$')]],
    'address': this.formBuilder.group({
      'street': ['', [Validators.required]],
      'houseNumber': ['', [Validators.required, Validators.minLength(1), Validators.min(1)]],
      'postBox': [''],
      'postalCode': ['', [Validators.required]],
      'city': ['', [Validators.required]],
      'country': ['', [Validators.required]]
    }),
    'role': new FormControl('')
  });

  firebaseErrorMessage: string;


  constructor(private formBuilder: FormBuilder, private afAuth: AngularFireAuth,
              private fireStore: AngularFirestore, private router: Router, private init: InitService
  ) {
    this.firebaseErrorMessage = '';
  }

  ngOnInit(): void {
    this.countries = Countries.getCountries();
    document.addEventListener('DOMContentLoaded', function () {
      var elems = document.querySelectorAll('.modal');
      M.Modal.init(elems, {
        dismissible: true,
      });
    });

    $(document).ready(() => {
      $('.datepicker').datepicker({
        format: "dd/mm/yyyy",
        yearRange: [1900, new Date().getFullYear() - 18],
        defaultDate: new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDay()),
        maxDate: new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDay() - 1),
        onSelect: () => {
          this.signupForm.patchValue({
            dateOfBirth: this
          })
        }
      });
    });
    this.init.initSelect();
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
        M.toast({html: `${error}`, classes: 'rounded red'})
        if (error.code)
          return {isValid: false, message: error.message};
      });
  }

  onSubmit() {
    this.signupForm.patchValue({
      dateOfBirth: $('.datepicker').val()
    })
    this.signupForm.markAllAsTouched();

    if (this.signupForm.invalid) {
      M.toast({html: 'Oops! Iets vergeten? Correct formaat gebruikt?', classes: 'rounded red'});
    } else {

      this.signupUser()!.then(() => {
        M.toast({html: `Succesvol ingeschreven!`, classes: 'rounded teal'});
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

  setCountry(countryCode: string) {
    this.countryCode = countryCode;

    this.cities = Cities.getCities({
        filters:
          {country_code: `${this.countryCode}`}
      }
    )
    this.init.initSelect();
    let cntry = Countries.getCountries({
        filters: {
          iso2: this.countryCode
        }
      }
    );

    this.signupForm.get(['address'])?.patchValue({
      country: cntry.map((c) => {
        return c.name
      })
    })
  }

  setCity(city: string) {
    this.citySelect = city;
    this.signupForm.get(['address'])?.patchValue({
      city: this.citySelect
    })
  }
}
