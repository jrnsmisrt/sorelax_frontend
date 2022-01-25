import {AfterViewInit, Component, NgModule, OnInit} from '@angular/core';
import {InitService} from "../../materialize/init.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, AfterViewInit {

  constructor(private initService : InitService) { }


  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.initService.initParallax();
  }

}
