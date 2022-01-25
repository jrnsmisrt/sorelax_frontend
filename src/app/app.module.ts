import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {environment} from "../environments/environment";
import { HomeComponent } from './home/home.component';
import {FirebaseService} from "./services/firebase.service";
import {AngularFireModule} from "@angular/fire/compat";
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {LayoutComponent} from "./layout/layout/layout.component";

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
  ],
  providers: [
    FirebaseService
  ],
  exports: [
    HomeComponent
  ],
  bootstrap: [
    AppComponent]
})
export class AppModule { }
