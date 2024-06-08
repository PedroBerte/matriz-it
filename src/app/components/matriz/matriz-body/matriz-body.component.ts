import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { MatrizService } from '../../../services/matriz.service';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormArray,
} from '@angular/forms';

@Component({
  selector: 'app-matriz-body',
  templateUrl: './matriz-body.component.html',
})
export class MatrizBodyComponent implements OnInit {
  matriz: number[][] = [[]];

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

  matrizForm: FormGroup;

  constructor(
    private matrizService: MatrizService,
    private formBuilder: FormBuilder,
    private elRef: ElementRef
  ) {
    this.matrizForm = this.formBuilder.group({
      inputCell: ['0', [Validators.required, this.onlyNumbersValidator()]],
    });
  }

  ngOnInit(): void {
    this.matriz = this.matrizService.getMatriz();
  }

  get inputCell() {
    return this.matrizForm.get('inputCell');
  }

  onlyNumbersValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = /^[0-9]+$/.test(control.value);
      return isValid ? null : { onlyNumbers: true };
    };
  }

  focusNextInput(event: any, lineIndex: number, colIndex: number) {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (lineIndex + 1 > this.currentLenght) {
        colIndex++;
        lineIndex = -1;
      }

      const nextInput = this.elRef.nativeElement.querySelector(
        `input[data-line="${lineIndex + 1}"][data-col="${colIndex}"]`
      );

      if (nextInput) nextInput.focus();
    }
  }

  disableAllArrows() {
    this.isRightArrowDisabled = false;
    this.isLeftArrowDisabled = false;
    this.isDownArrowDisabled = false;
    this.isUpArrowDisabled = false;
  }

  checkButton() {
    this.disableAllArrows();
    if (this.currentHeight >= this.maxHeight) this.isDownArrowDisabled = true;

    if (this.currentHeight <= this.minHeight) this.isUpArrowDisabled = true;

    if (this.currentLenght >= this.maxLenght) this.isRightArrowDisabled = true;

    if (this.currentLenght <= this.minLenght) this.isLeftArrowDisabled = true;
  }

  handleStartMatriz() {
    this.matrizService.startMatriz(2);
    this.currentHeight = 2;
    this.currentLenght = 2;
  }

  handleSizeChange(direction: string) {
    switch (direction) {
      case 'arrow-up':
        if (this.isUpArrowDisabled) return;

        this.matrizService.decrementVertical();
        this.currentHeight = this.currentHeight - 1;
        break;
      case 'arrow-down':
        if (this.isDownArrowDisabled) return;

        this.matrizService.incrementVertical();
        this.currentHeight = this.currentHeight + 1;
        break;
      case 'arrow-left':
        if (this.isLeftArrowDisabled) return;

        this.matrizService.decrementHorizontal();
        this.currentLenght = this.currentLenght - 1;
        break;
      case 'arrow-right':
        if (this.isRightArrowDisabled) return;

        this.matrizService.incrementHorizontal();
        this.currentLenght = this.currentLenght + 1;
        break;
    }
    this.checkButton();
  }
}
