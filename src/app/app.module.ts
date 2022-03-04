import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {environment} from "../environments/environment";
import {AngularFireModule} from "@angular/fire/compat";
import {provideAuth, getAuth} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {AppRoutingModule} from "./app-routing/app-routing.module";
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {LayoutModule} from "./layout/layout.module";
import {HomeComponent} from "./static-web-pages/home/home.component";
import { SignupComponent } from './dynamic-web-pages/signup/signup.component';
import { LoginComponent } from './dynamic-web-pages/login/login.component';
import { DashboardComponent } from './dynamic-web-pages/dashboard/dashboard.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import {AngularFirestore, AngularFirestoreModule} from "@angular/fire/compat/firestore";
import { BookingComponent } from './dynamic-web-pages/booking-create/booking.component';
import { AboutComponent } from './static-web-pages/about/about.component';
import { MassageComponent } from './static-web-pages/massage/massage.component';
import { ContactComponent } from './static-web-pages/contact/contact.component';
import { UsersOverviewComponent } from './user/users-overview/users-overview.component';
import { BookingOverviewComponent } from './dynamic-web-pages/booking-overview/booking-overview.component';
import { CreateTimeslotComponent } from './dynamic-web-pages/create-timeslot/create-timeslot.component';
import { AdminBookingOverviewComponent } from './dynamic-web-pages/admin-booking-overview/admin-booking-overview.component';
import { TimeslotOverviewComponent } from './dynamic-web-pages/timeslot-overview/timeslot-overview.component';
import {AvailabilityPipe} from "./pipes/AvailabilityPipe";
import {FilterUserName} from "./pipes/Filter-UserName";
import {FilterDate} from "./pipes/Filter-Date";


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
    FilterDate


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
  providers: [AngularFirestore, AvailabilityPipe, FilterUserName, FilterDate],

  bootstrap: [
    AppComponent]
})
export class AppModule {
}
