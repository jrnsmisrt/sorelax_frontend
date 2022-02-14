import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "../static-web-pages/home/home.component";
import {LoginComponent} from "../dynamic-web-pages/login/login.component";
import {SignupComponent} from "../dynamic-web-pages/signup/signup.component";
import {DashboardComponent} from "../dynamic-web-pages/dashboard/dashboard.component";

import {AuthGuard} from "../services/auth.guard";
import {UserProfileComponent} from "../user/user-profile/user-profile.component";
import {BookingComponent} from "../dynamic-web-pages/booking/booking.component";
import {AboutComponent} from "../static-web-pages/about/about.component";
import {MassageComponent} from "../static-web-pages/massage/massage.component";
import {UsersOverviewComponent} from "../user/users-overview/users-overview.component";
import {BookingOverviewComponent} from "../dynamic-web-pages/booking-overview/booking-overview.component";

const routes:Routes = [
  {path:'', redirectTo: 'home', pathMatch:'full'},
  {path:'home', component: HomeComponent},
  {path:'about', component: AboutComponent},
  {path:'massages', component: MassageComponent},
  {path:'login', component: LoginComponent},
  {path:'signup', component: SignupComponent},
  {path: 'users/:id/bookmassage', component: BookingComponent, canActivate:[AuthGuard]},
  {path: 'users/overview', component: UsersOverviewComponent},
  {path:'users/:id/profile', component: UserProfileComponent, canActivate:[AuthGuard]},
  {path:'users/:id/dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path:'users/:id/booking-overview', component: BookingOverviewComponent},
  {path:'**', component: HomeComponent}
]

@NgModule({
    declarations: [
    ],
  imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
