import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-arrows',
  templateUrl: './arrows.component.html',
})
export class ArrowsComponent {
  @Input() direction: string = '';
  @Output() sizeChangeEvent = new EventEmitter<string>();
  @Input() isDisabled = false;

  handleChangeSize(direction: string) {
    this.sizeChangeEvent.emit(direction);
  }
}
