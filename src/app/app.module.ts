import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {environment} from "../environments/environment";
import {AngularFireModule} from "@angular/fire/compat";
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {provideAuth, getAuth} from '@angular/fire/auth';
import {provideDatabase, getDatabase} from '@angular/fire/database';
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {AppRoutingModule} from "./app-routing/app-routing.module";
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {LayoutModule} from "./layout/layout.module";
import {HomeComponent} from "./static-web-pages/home/home.component";
import { SignupComponent } from './dynamic-web-pages/signup/signup.component';
import { LoginComponent } from './dynamic-web-pages/login/login.component';
import { DashboardComponent } from './dynamic-web-pages/dashboard/dashboard.component';
import {ReactiveFormsModule} from "@angular/forms";
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import {AngularFirestore, AngularFirestoreModule} from "@angular/fire/compat/firestore";
import { BookingComponent } from './dynamic-web-pages/booking/booking.component';
import { AboutComponent } from './static-web-pages/about/about.component';
import { MassageComponent } from './static-web-pages/massage/massage.component';
import { ContactComponent } from './static-web-pages/contact/contact.component';
import { UsersOverviewComponent } from './user/users-overview/users-overview.component';


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
    UsersOverviewComponent


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
  ],
  providers: [AngularFirestore],

  bootstrap: [
    AppComponent]
})
export class AppModule {
}
