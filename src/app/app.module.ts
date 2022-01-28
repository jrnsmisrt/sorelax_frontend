import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {environment} from "../environments/environment";
import {FirebaseService} from "./services/firebase.service";
import {AngularFireModule} from "@angular/fire/compat";
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {provideAuth, getAuth} from '@angular/fire/auth';
import {provideDatabase, getDatabase} from '@angular/fire/database';
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {AppRoutingModule} from "./app-routing/app-routing.module";
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {LayoutModule} from "./layout/layout.module";
import {HomeComponent} from "./home/home.component";
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {ReactiveFormsModule} from "@angular/forms";
import { UserProfileComponent } from './user/user-profile/user-profile.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    LoginComponent,
    DashboardComponent,
    UserProfileComponent


  ],
  imports: [
    BrowserModule,
    LayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    AppRoutingModule,
    RouterModule.forRoot([]),
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    FirebaseService
  ],

  bootstrap: [
    AppComponent]
})
export class AppModule {
}
