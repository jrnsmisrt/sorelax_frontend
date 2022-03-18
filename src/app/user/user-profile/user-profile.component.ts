import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {Observable, tap} from "rxjs";
import {User} from "../../model/User";
import {ActivatedRoute} from "@angular/router";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {InitService} from "../../materialize/init.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
  user!: Observable<User | undefined>;
  isEditable = false;

  editFirstName!: string | undefined;
  editLastName!: string | undefined;
  editDateOfBirth!: string | undefined;
  editEmail!: string | undefined;
  editPhoneNumber!: string | undefined;
  editStreet!: string | undefined;
  editHouseNumber!: string | undefined;
  editPostBox!: string | undefined;
  editPostalCode!: string | undefined;
  editCity!: string | undefined;
  editCountry!: string | undefined;
  editAddress!: { street: string; houseNumber: string; postBox: string; postalCode: string; city: string; country: string } | undefined;

  editUser!: Observable<User | undefined>;
  editProfileForm!: FormGroup;

  constructor(private userService: UserService, private route: ActivatedRoute,
              private fireStore: AngularFirestore, private formBuilder: FormBuilder,
              private init: InitService) {
  }

  ngOnInit() {
    this.init.initDatePicker();
    this.setUser();
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
    })
    this.setEditUser();
    this.user.subscribe((user)=>{
      this.editProfileForm.patchValue({
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        dateOfBirth: user?.dateOfBirth,
        address: user?.address,
        phoneNumber: user?.phoneNumber
      })
    })

  }

  setUser() {
    this.user = this.fireStore.collection<User>('users').doc(this.route.snapshot.paramMap.get('id')!).valueChanges();
  }

  editProfile() {
    this.isEditable = true;
  }

  clearForm(){
    this.isEditable = false;
  }

  saveProfile() {
    this.isEditable = false;
    this.fireStore.collection<User>('users').doc(this.route.snapshot.paramMap.get('id')!).update(this.editProfileForm.value);
  }

  private setEditUser() {
    this.editUser = this.user.pipe(tap(user => {
      this.editProfileForm.patchValue({
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        dateOfBirth: user?.dateOfBirth,
        address: user?.address,
        phoneNumber: user?.phoneNumber
      });
    }));
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
}
