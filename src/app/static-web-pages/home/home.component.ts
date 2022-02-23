import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {InitService} from "../../materialize/init.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(public afAuth: AngularFireAuth, private initService: InitService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initService.initParallax();
    this.initService.initSlider();
  }



}
