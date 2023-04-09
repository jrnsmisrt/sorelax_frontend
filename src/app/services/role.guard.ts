import {Injectable, OnDestroy} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, Subject, takeUntil} from 'rxjs';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {User} from "../model/User";
import {getAuth} from "@angular/fire/auth";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate, OnDestroy {
  user = this.fireStore.collection<User>('users').doc(getAuth().currentUser?.uid).valueChanges();
  private destroyer$ = new Subject();

  constructor(private fireStore: AngularFirestore, private router: Router, private auth: AuthService) {
  }

  ngOnDestroy(): void {
    this.destroyer$.next(true);
    this.destroyer$.complete();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (!this?.isAdmin()) {
      M.toast({html: 'Access Denied, You are not an administrator!', classes: 'rounded custom-toast'})
      this.router.navigate([`users/${this.auth.getUserUid()}/profile`]);
      return false;
    } else {
      return true;
    }
  }

  async isAdmin(): Promise<boolean> {
    let isAdmin!: boolean;
    this.fireStore.collection<User>('users').doc(getAuth().currentUser?.uid).valueChanges()
      .pipe(takeUntil(this.destroyer$))
      .subscribe((user) => {
        isAdmin = user?.role === 'admin';
      });
    return isAdmin;
  }

}
