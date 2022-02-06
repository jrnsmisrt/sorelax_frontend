import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "../home/home.component";
import {LoginComponent} from "../login/login.component";
import {SignupComponent} from "../signup/signup.component";
import {DashboardComponent} from "../dashboard/dashboard.component";

import {AuthGuard} from "../services/auth.guard";
import {UserProfileComponent} from "../user/user-profile/user-profile.component";
import {BookingComponent} from "../booking/booking.component";
import {AboutComponent} from "../about/about.component";
import {MassageComponent} from "../massage/massage.component";

const routes:Routes = [
  {path:'', redirectTo: 'home', pathMatch:'full'},
  {path:'home', component: HomeComponent},
  {path:'about', component: AboutComponent},
  {path:'massages', component: MassageComponent},
  {path:'login', component: LoginComponent},
  {path:'signup', component: SignupComponent},
  {path:'users/:id/profile', component: UserProfileComponent, canActivate:[AuthGuard]},
  {path: 'users/:id/bookmassage', component: BookingComponent, canActivate:[AuthGuard]},
  {path:'users/:id/dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path:'**', component: HomeComponent}
]

@NgModule({
    declarations: [
    ],
  imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
