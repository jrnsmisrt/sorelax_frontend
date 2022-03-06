import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {User} from "../model/User";
import {getAuth} from "@angular/fire/auth";
import {UserService} from "./user.service";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  user = this.fireStore.collection<User>('users').doc(getAuth().currentUser?.uid).valueChanges();

  constructor(private fireStore: AngularFirestore, private router: Router, private auth: AuthService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (!this?.isAdmin()) {
      M.toast({html: 'Access Denied, You are not an administrator!', classes: 'rounded custom-toast'})
      this.router.navigate([`users/${this.auth.getUserUid()}/profile`]);      return false;
    } else {
      return true;
    }
  }

  async isAdmin(): Promise<boolean> {
    let isAdmin!: boolean;
    await this.fireStore.collection<User>('users').doc(getAuth().currentUser?.uid).valueChanges().subscribe((user) => {
      isAdmin = user?.role === 'admin';
    });
    return isAdmin;
  }

}
