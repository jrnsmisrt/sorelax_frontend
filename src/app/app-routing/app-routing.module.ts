import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "../static-web-pages/home/home.component";
import {LoginComponent} from "../login/login.component";
import {SignupComponent} from "../signup/signup.component";
import {DashboardComponent} from "../dashboard/dashboard.component";

import {AuthGuard} from "../services/auth.guard";
import {UserProfileComponent} from "../user/user-profile/user-profile.component";
import {BookingComponent} from "../booking-create/booking.component";
import {AboutComponent} from "../static-web-pages/about/about.component";
import {MassageComponent} from "../static-web-pages/massage/massage.component";
import {UsersOverviewComponent} from "../user/users-overview/users-overview.component";
import {BookingOverviewComponent} from "../booking-overview/booking-overview.component";
import {CreateTimeslotComponent} from "../create-timeslot/create-timeslot.component";
import {
  AdminBookingOverviewComponent
} from "../admin-booking-overview/admin-booking-overview.component";
import {RoleGuard} from "../services/role.guard";
import {TimeslotOverviewComponent} from "../timeslot-overview/timeslot-overview.component";
import {ContactComponent} from "../static-web-pages/contact/contact.component";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'massages', component: MassageComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'users/overview', component: UsersOverviewComponent, canActivate: [RoleGuard, AuthGuard]},
  {path: 'users/:id/bookmassage', component: BookingComponent, canActivate: [AuthGuard]},
  {path: 'users/:id/profile', component: UserProfileComponent, canActivate: [AuthGuard]},
  {path: 'users/:id/dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'users/:id/booking-overview', component: BookingOverviewComponent, canActivate: [AuthGuard]},
  {path: 'timeslots/create-timeslot', component: CreateTimeslotComponent, canActivate: [RoleGuard, AuthGuard]},
  {path: 'timeslots/overview', component: TimeslotOverviewComponent, canActivate: [RoleGuard, AuthGuard]},
  {path: 'bookings/overview', component: AdminBookingOverviewComponent, canActivate: [RoleGuard, AuthGuard]},
  {path: '**', component: HomeComponent}
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
