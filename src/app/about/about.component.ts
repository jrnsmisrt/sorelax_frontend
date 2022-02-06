import {AfterViewInit, Component, OnInit} from '@angular/core';
import {InitService} from "../materialize/init.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, AfterViewInit {

  constructor(private initService: InitService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.initService.initParallax();
  }

}
