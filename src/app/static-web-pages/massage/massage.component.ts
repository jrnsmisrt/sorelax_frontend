import {AfterViewInit, Component, OnInit} from '@angular/core';
import {InitService} from "../../materialize/init.service";

@Component({
  selector: 'app-massage',
  templateUrl: './massage.component.html',
  styleUrls: ['./massage.component.css']
})
export class MassageComponent implements OnInit, AfterViewInit {

  constructor(private initService: InitService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.initService.initParallax();
  }

}
