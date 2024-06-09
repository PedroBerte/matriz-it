import { Component } from '@angular/core';
import { routes } from '../../app-routing.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  routes = routes;
}
