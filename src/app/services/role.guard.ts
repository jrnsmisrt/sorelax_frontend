import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {User} from "../model/User";
import {getAuth} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  user = this.fireStore.collection<User>('users').doc(getAuth().currentUser?.uid).valueChanges();
  role!:string | undefined;
  constructor(private fireStore: AngularFirestore, private router: Router) {
    this.isAdmin();
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if(this.role!=='admin') {
      console.log(this.role);

      M.toast({html:'Access Denied, You are not an administrator!', classes:'rounded custom-toast'})
      this.router.navigate(['login']);
    }
    return true;
  }

  async isAdmin(){
    await this.user.subscribe((u)=>{
      return this.role = u?.role;
    })
  }
}
