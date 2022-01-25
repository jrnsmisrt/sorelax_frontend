import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {signOut} from "@angular/fire/auth";
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  isLoggedIn = false
  constructor(private firebaseAuth: AngularFireAuth, private fireDb : AngularFireDatabase) { }

  async signIn(email:string, password:string){
    await this.firebaseAuth.signInWithEmailAndPassword(email,password)
      .then(response=>{
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify((response.user)))
      })
  }

  async signUp(email:string, password:string){
    await this.firebaseAuth.createUserWithEmailAndPassword(email,password)
      .then(response=>{
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify((response.user)))
      })
  }

  logOut(){
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');


  }

}
