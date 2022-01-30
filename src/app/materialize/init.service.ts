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


 /* initSideNav():any{
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

*/
}
