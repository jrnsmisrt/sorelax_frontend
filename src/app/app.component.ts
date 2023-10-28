import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {InitService} from "./materialize/init.service";
import {UserService} from "./services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Sorelax';

  /**
   * REFACTOR SO AUTH IS INITIATED HERE
   */

  // set login/auth info
  // init all materialize elements

  constructor(private authService: AuthService,
              private userService: UserService,
              private initService: InitService) {
  }

  ngOnInit(): void {
    this.initMatElements();
    this.userService.userDoc.valueChanges().subscribe(x => console.log(x));
    this.authService.authState.subscribe(x=>console.log(x));
  }

  private initMatElements() {
    this.initService.initModal();
    this.initService.initCollapsible();
    this.initService.initSelect();
    this.initService.initDropdown();
    this.initService.initParallax();
    this.initService.initDatePicker();
    this.initService.initTimePicker();
    this.initService.initSideNav();
    this.initService.initSlider();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }

}
