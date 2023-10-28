import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {firstValueFrom, map, Observable} from 'rxjs';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const userSignedIn = async () => {
      const f = await firstValueFrom(this.auth.authState.pipe(map(a => a?.uid)));
      return (!!f);
    }

    return userSignedIn().then((s) => {
      if (!s) {
        M.toast({html: 'Access Denied, Login is Required to Access This Page!'})
        this.router.navigate(['login']).then();
      }

      return s;
    });
  }
}
