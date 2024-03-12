import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-matriz-body',
  templateUrl: './matriz-body.component.html',
})
export class MatrizBodyComponent {
  @Input() matriz: Array<number[]> = [[]];

  maxHeight = 10;
  maxLenght = 10;

  minHeight = 1;
  minLenght = 1;

  currentHeight = 0;
  currentLenght = 0;

  isRightArrowDisabled = false;
  isLeftArrowDisabled = false;
  isDownArrowDisabled = false;
  isUpArrowDisabled = false;

  checkButton() {
    this.isRightArrowDisabled = false;
    this.isLeftArrowDisabled = false;
    this.isDownArrowDisabled = false;
    this.isUpArrowDisabled = false;

    if (this.currentHeight == this.maxHeight) this.isDownArrowDisabled = true;
    if (this.currentHeight == this.minHeight) this.isUpArrowDisabled = true;
    if (this.currentLenght == this.maxLenght) this.isRightArrowDisabled = true;
    if (this.currentLenght == this.minLenght) this.isLeftArrowDisabled = true;
  }

  handleIncrementHorizontal() {
    const matrizLenght = this.matriz[0].length;
    if (matrizLenght >= this.maxLenght) return;
    this.matriz.forEach((element) => {
      element.push(0);
    });
    this.currentLenght++;
  }

  handleIncrementVertical() {
    const matrizLenght = this.matriz[0].length;
    const matrizHeight = this.matriz.length;
    if (matrizHeight >= this.maxHeight) return;
    let newRow = [];
    for (var i = 0; i < matrizLenght; i++) {
      newRow.push(0);
    }
    this.matriz.push(newRow);
    this.currentHeight++;
  }

  handleDecrementHorizontal() {
    const matrizLenght = this.matriz[0].length;
    if (matrizLenght === this.minLenght) return;
    console.log(matrizLenght, this.maxLenght);
    this.matriz.forEach((element) => {
      element.pop();
    });
    this.currentLenght--;
  }

  handleDecrementVertical() {
    const matrizHeight = this.matriz.length;
    if (matrizHeight === this.minHeight) return;
    this.matriz.pop();
    this.currentHeight--;
  }

  handleSizeChange(direction: string) {
    switch (direction) {
      case 'arrow-up':
        this.handleDecrementVertical();
        break;
      case 'arrow-down':
        this.handleIncrementVertical();
        break;
      case 'arrow-left':
        this.handleDecrementHorizontal();
        break;
      case 'arrow-right':
        this.handleIncrementHorizontal();
        break;
    }
    this.checkButton();
  }
}
