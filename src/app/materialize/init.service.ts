import { Injectable } from '@angular/core';
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor() { }

  initParallax() {
    setTimeout(() => {
      console.log('init parallax');
      M.Parallax.init(document.querySelectorAll('.parallax'));
    }, 1);
  }

  initSideNav():any{
    $(document).ready(function(){
      console.log('init sidenav')
      $('.sidenav').sidenav();
    });
  }

  initSelect(){
    $(document).ready(function(){
      $('select').formSelect();
    });
  }

  initTimePicker() {
    $(document).ready(function () {
      $('.timepicker').timepicker({
        autoClose: true,
        twelveHour: false,
        showClearBtn: true,
      });
    });
  }

  initDatePicker() {
    var currYear = (new Date()).getFullYear();
    let currMonth = (new Date()).getMonth();
    let currDay = (new Date()).getDay();

    $(document).ready(function () {
      $(".datepicker").datepicker({
          format: 'dd/mm/yyyy',
          defaultDate: new Date(currYear, currMonth, currDay),
          minDate: new Date(Date.now()),
          maxDate: new Date(currYear + 1, currMonth, currDay),
          showClearBtn: true,
          autoClose: true
        },
      );

    });

  }

  initSlider(){
    $(document).ready(function(){
      $('.slider').slider();
    });
  }

}
