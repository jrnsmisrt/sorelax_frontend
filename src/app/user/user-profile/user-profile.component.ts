import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {Observable} from "rxjs";
import {User} from "../../model/User";
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {InitService} from "../../materialize/init.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat/app";
import auth = firebase.auth;
import {Cities, Countries} from "countries-states-cities-service/lib/src";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
  user!: Observable<User | undefined>;
  isEditable = false;
  currentUserEmail!: string | null;
  editUser!: Observable<User | undefined>;
  editProfileForm!: FormGroup;
  confirmPasswordForm!: FormGroup;
  changePasswordForm!: FormGroup;
  unRegisterPasswordForm!: FormGroup
  isPasswordEqual!: boolean;

  countries!: any[];
  cities!: any[];
  countrySelect: any;
  countryCode: string = 'BE';
  citySelect: any;

  constructor(private userService: UserService, private route: ActivatedRoute,
              private router: Router,
              private fireStore: AngularFirestore, private afAuth: AngularFireAuth,
              private formBuilder: FormBuilder,
              private init: InitService) {
  }

  ngOnInit() {
    this.countries = Countries.getCountries();
    this.init.initModal();
    this.setUser();
    this.currentUserEmail = auth().currentUser!.email;
    this.editProfileForm = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.pattern('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])'), Validators.email]],
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
      })
    });
    this.user.subscribe((user) => {
      this.editProfileForm.patchValue({
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        dateOfBirth: user?.dateOfBirth,
        address: user?.address,
        phoneNumber: user?.phoneNumber
      })
    });

    this.confirmPasswordForm = this.formBuilder.group({
      'password': ['', Validators.required]
    })

    this.changePasswordForm = this.formBuilder.group({
      'currentPassword': ['', Validators.required],
      'newPassword': ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]],
      'newPasswordConfirmation': ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]]
    })

    this.unRegisterPasswordForm = this.formBuilder.group({
      'deleteUserPassword': ['', Validators.required]
    })

  }

  setUser() {
    this.user = this.fireStore.collection<User>('users').doc(this.route.snapshot.paramMap.get('id')!).valueChanges();
  }

  editProfile() {
    this.isEditable = true;
    this.init.initSelect();
    $(document).ready(function () {
      var currYear = (new Date()).getFullYear();
      let currMonth = (new Date()).getMonth();
      let currDay = (new Date()).getDay();

      $(".datepicker").datepicker({
          format: 'dd/mm/yyyy',
          maxDate: new Date(currYear - 18, currMonth, currDay),
          autoClose: true
        },
      );

    });
  }

  clearForm() {
    this.isEditable = false;
  }

  saveProfile() {
    if (this.editProfileForm.valid) {
      if (this.email?.value != this.currentUserEmail) {
        M.Modal.getInstance(document.querySelector('#confirmEmailChangeModal')!).open();
      } else {
        this.saveUserData();
        this.isEditable = false;
      }
    }
  }

  private static reauthenticate(currentPassword: string) {
    let user = firebase.auth().currentUser;
    let cred = firebase.auth.EmailAuthProvider.credential(
      <string>user?.email, currentPassword);
    return user!.reauthenticateWithCredential(cred);
  };

  private saveUserData() {
    this.fireStore.collection<User>('users').doc(this.route.snapshot.paramMap.get('id')!).update(this.editProfileForm.value)
      .then(() => {
        M.toast({html: 'Profile has been updated', classes: 'rounded teal'});
        this.isEditable = false;
      }).catch((error) => {
      M.toast({html: `${error}`, classes: 'rounded teal'});
      console.log(error);
    });
  }

  unregisterProfile() {
    M.Modal.getInstance(document.querySelector('#unregisterModal')!).open();
  }

  confirmUnregisterProfile() {
    this.fireStore.collection<User>('deleted-users').doc(this.route.snapshot.paramMap.get('id')!).set(this.editProfileForm.value)
      .then(() => {
      })
      .catch((error) => {
        console.log(error)
      });
    UserProfileComponent.reauthenticate(this.deleteUserPassword?.value).then(() => {
      this.fireStore.collection<User>('users').doc(this.route.snapshot.paramMap.get('id')!)
        .delete()
        .then(() => {
          auth().currentUser?.delete().then(() => {
            M.toast({html: 'Succesfully unregistered', classes: 'rounded teal'});
            this.router.navigate(['login']);
          })
        }).catch((error) => {
        M.toast({html: `${error}`, classes: 'rounded red'})
      })
    });
  }

  setPasswordForEmailChange() {
    UserProfileComponent.reauthenticate(this.password?.value).then(() => {
      auth().currentUser!.updateEmail(this.email?.value)
        .then(() => {
          M.toast({
            html: 'E-mail adres is veranderd',
            classes: 'rounded teal'
          });
          auth().currentUser!.sendEmailVerification()
            .then(() => {
              M.toast({
                html: 'Gelieve uw e-mail inbox te controleren',
                classes: 'rounded teal'
              });
            })
            .catch((error) => {
              M.toast({html: `${error}`, classes: 'rounded red'})
            })
        })
        .catch((error) => {
          M.toast({html: `${error}`, classes: 'rounded red'});
        });
    });

    M.Modal.getInstance(document.querySelector('#confirmEmailChangeModal')!).close();
    this.saveUserData();
  }

  openChangePasswordModal() {
    M.Modal.getInstance(document.querySelector('#changePasswordModal')!).open();
  }

  changePassword() {
    UserProfileComponent.reauthenticate(this.currentPassword?.value).then(() => {
      if (this.newPassword?.value === this.newPasswordConfirmation?.value) {
        this.isPasswordEqual = true;
        auth().currentUser!.updatePassword(this.newPassword?.value).then(() => {
          M.toast({html: 'Paswoord succesvol veranderd', classes: 'rounded teal'});
          M.Modal.getInstance(document.querySelector('#changePasswordModal')!).close();
        }).catch((error) => {
          M.toast({html: `${error}`, classes: 'rounded red'});
        });
      } else {
        M.toast({html: 'Paswoorden zijn niet gelijk', classes: 'rounded red'});
      }
    }).catch(() => {
      M.toast({html: `Verkeerd paswoord.`, classes: 'rounded red'});
    });
  }

  get firstName() {
    return this.editProfileForm.get('firstName');
  }

  get lastName() {
    return this.editProfileForm.get('lastName');
  }

  get dateOfBirth() {
    return this.editProfileForm.get('dateOfBirth');
  }

  get phoneNumber() {
    return this.editProfileForm.get('phoneNumber');
  }

  get street() {
    return this.editProfileForm.get('address.street');
  }

  get houseNr() {
    return this.editProfileForm.get('address.houseNumber');
  }

  get postalCode() {
    return this.editProfileForm.get('address.postalCode');
  }

  get postBox() {
    return this.editProfileForm.get('address.postBox');
  }

  get city() {
    return this.editProfileForm.get('address.city');
  }

  get country() {
    return this.editProfileForm.get('address.country');
  }

  get address() {
    return this.editProfileForm.get('address');
  }

  get email() {
    return this.editProfileForm.get('email');
  }

  get password() {
    return this.confirmPasswordForm.get('password');
  }

  get currentPassword() {
    return this.changePasswordForm.get('currentPassword');
  }

  get newPassword() {
    return this.changePasswordForm.get('newPassword');
  }

  get newPasswordConfirmation() {
    return this.changePasswordForm.get('newPasswordConfirmation');
  }

  get deleteUserPassword() {
    return this.unRegisterPasswordForm.get('deleteUserPassword')
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

    this.editProfileForm.get(['address'])?.patchValue({
      country: cntry.map((c) => {
        return c.name
      })
    })
  }

  setCity(city: string) {
    this.citySelect = city;
    this.editProfileForm.get(['address'])?.patchValue({
      city: this.citySelect
    })
  }
}
