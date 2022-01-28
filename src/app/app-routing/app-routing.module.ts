import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "../home/home.component";
import {LoginComponent} from "../login/login.component";
import {SignupComponent} from "../signup/signup.component";
import {DashboardComponent} from "../dashboard/dashboard.component";

import {AuthGuard} from "../services/auth.guard";
import {UserProfileComponent} from "../user/user-profile/user-profile.component";

const routes:Routes = [
  {path:'', redirectTo: 'home', pathMatch:'full'},
  {path:'home', component: HomeComponent},
  {path:'login', component: LoginComponent},
  {path:'users/profile', component: UserProfileComponent},
  {path:'signup', component: SignupComponent},
  {path:'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path:'**', component: HomeComponent}
]

@NgModule({
    declarations: [
    ],
  imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
