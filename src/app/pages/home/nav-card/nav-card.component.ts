import { Component, Input, Type } from '@angular/core';
import { Resolve, ResolveFn } from '@angular/router';

@Component({
  selector: 'app-nav-card',
  templateUrl: './nav-card.component.html',
})
export class NavCardComponent {
  @Input() name: string | Type<Resolve<string>> | ResolveFn<string> | undefined = '';
  @Input() path: string = '';
}
