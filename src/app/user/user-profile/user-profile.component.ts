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
  isPasswordEqual!: boolean;

  constructor(private userService: UserService, private route: ActivatedRoute,
              private router: Router,
              private fireStore: AngularFirestore, private afAuth: AngularFireAuth,
              private formBuilder: FormBuilder,
              private init: InitService) {
  }

  ngOnInit() {
    this.init.initModal();
    this.setUser();
    this.currentUserEmail = auth().currentUser!.email;
    this.editProfileForm = this.formBuilder.group({
      'email': ['', [Validators.email, Validators.required]],
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required],
      'dateOfBirth': ['', Validators.required],
      'phoneNumber': ['', Validators.required],
      'address': this.formBuilder.group({
        'street': ['', Validators.required],
        'houseNumber': ['', Validators.required],
        'postBox': [''],
        'postalCode': ['', Validators.required],
        'city': ['', Validators.required],
        'country': ['', Validators.required]
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

  }

  setUser() {
    this.user = this.fireStore.collection<User>('users').doc(this.route.snapshot.paramMap.get('id')!).valueChanges();
  }

  editProfile() {
    this.isEditable = true;
    this.init.initDatePicker();
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
  }

  setPassword() {
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
}
