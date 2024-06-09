import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MatrizService {
  constructor() {}
  matriz: number[][] = [[]];

  startMatriz(size: number) {
    this.matriz.forEach((element) => {
      element.push(0);
    });

    for (let i = 0; i < size; i++) {
      this.incrementHorizontal();
      this.incrementVertical();
    }
  }

  incrementHorizontal() {
    this.matriz.forEach((element) => {
      element.push(0);
    });
  }

  incrementVertical() {
    const matrizLenght = this.matriz[0].length;
    let newRow = [];
    for (var i = 0; i < matrizLenght; i++) {
      newRow.push(0);
    }
    this.matriz.push(newRow);
  }

  decrementHorizontal() {
    this.matriz.forEach((element) => {
      element.pop();
    });
  }

  decrementVertical() {
    this.matriz.pop();
  }


  getMatriz(): number[][] {
    return this.matriz;
  }


  setMatriz(matriz: number[][]): void {
    this.matriz = matriz;
  }
}
