import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {environment} from "../environments/environment";
import {AngularFireModule} from "@angular/fire/compat";
import {getAuth, provideAuth} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {AppRoutingModule} from "./app-routing/app-routing.module";
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {LayoutModule} from "./layout/layout.module";
import {HomeComponent} from "./static-web-pages/home/home.component";
import {SignupComponent} from './signup/signup.component';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserProfileComponent} from './user/user-profile/user-profile.component';
import {AngularFirestore, AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {BookingComponent} from './booking-create/booking.component';
import {AboutComponent} from './static-web-pages/about/about.component';
import {MassageComponent} from './static-web-pages/massage/massage.component';
import {ContactComponent} from './static-web-pages/contact/contact.component';
import {UsersOverviewComponent} from './user/users-overview/users-overview.component';
import {BookingOverviewComponent} from './booking-overview/booking-overview.component';
import {CreateTimeslotComponent} from './create-timeslot/create-timeslot.component';
import {
  AdminBookingOverviewComponent
} from './admin-booking-overview/admin-booking-overview.component';
import {TimeslotOverviewComponent} from './timeslot-overview/timeslot-overview.component';
import {AvailabilityPipe} from "./pipes/AvailabilityPipe";
import {FilterUserName} from "./pipes/Filter-UserName";
import {FilterDate} from "./pipes/Filter-Date";
import {FilterStatus} from "./pipes/Filter-Status";
import {FilterMassage} from "./pipes/Filter-Massage";
import { AdminCreateBookingComponent } from './admin-create-booking/admin-create-booking.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    LoginComponent,
    DashboardComponent,
    UserProfileComponent,
    BookingComponent,
    AboutComponent,
    MassageComponent,
    ContactComponent,
    UsersOverviewComponent,
    BookingOverviewComponent,
    CreateTimeslotComponent,
    AdminBookingOverviewComponent,
    TimeslotOverviewComponent,
    AvailabilityPipe,
    FilterUserName,
    FilterDate,
    FilterStatus,
    FilterMassage,
    AdminCreateBookingComponent


  ],
  imports: [
    BrowserModule,
    LayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    provideAuth(() => getAuth()),
    AppRoutingModule,
    RouterModule.forRoot([]),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [AngularFirestore, AvailabilityPipe, FilterUserName, FilterDate, FilterStatus, FilterMassage],

  bootstrap: [
    AppComponent]
})
export class AppModule {
}
