import {Injectable, OnDestroy} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {firstValueFrom, map, mergeMap, Observable, Subject, takeUntil} from 'rxjs';
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

    const isAdmin = async () => {
      const isAdmin = await firstValueFrom(this.fireStore.collection<User>('users').valueChanges().pipe(takeUntil(this.destroyer$),
        mergeMap((users) => {
          return users.filter(u => u.id === getAuth().currentUser?.uid);
        }), map(user => user.role === 'admin')));
      return isAdmin;
    }

    return isAdmin().then((isAdmin) => {
      if (!isAdmin) {
        M.toast({html: 'Access Denied, You are not an administrator!', classes: 'rounded custom-toast'})
        this.router.navigate([`users/${this.auth.getUserUid()}/profile`]);
      }
      return isAdmin;
    })
  }
}
