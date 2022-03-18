import {Component, OnInit} from '@angular/core';
import {InitService} from "../../materialize/init.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {

  constructor(private initService: InitService) {
  }

  ngOnInit(): void {
    this.initService.initSideNav();

  }
}
