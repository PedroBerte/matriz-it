import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-cell',
  templateUrl: './input-cell.component.html',
})
export class InputCellComponent {
  @Input() item: string = '';
  itemValue: number = 0;
}
