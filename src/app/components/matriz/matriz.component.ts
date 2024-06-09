import { Component, ElementRef } from "@angular/core"
import { MatrizService } from "../../services/matriz.service"
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms"

enum MatrixType {
  SQUARE = "Matriz Quadrada",
  RECTANGULAR = "Matriz Retangular",
  DIAGONAL = "Matriz Diagonal",
  IDENTITY = "Matriz Identidade",
  NULL = "Matriz Nula",
  SYMMETRIC = "Matriz Simétrica",
  UPPER_TRIANGULAR = "Matriz Triangular Superior",
  LOWER_TRIANGULAR = "Matriz Triangular Inferior",
}

@Component({
  selector: "app-matriz",
  templateUrl: "./matriz.component.html",
})
export class MatrizComponent {
  matrizName = "Matriz"
  matriz: number[][] = [[]]
  maxHeight = 10
  maxLenght = 10

  minHeight = 1
  minLenght = 1

  currentHeight = 0
  currentLenght = 0

  isRightArrowDisabled = false
  isLeftArrowDisabled = false
  isDownArrowDisabled = false
  isUpArrowDisabled = false

  matrizForm: FormGroup

  constructor(private formBuilder: FormBuilder, private elRef: ElementRef) {
    this.matrizForm = this.formBuilder.group({
      matrizFormArray: this.formBuilder.array([]),
    })
  }

  ngOnInit(): void {
    this.initMatriz(3, 3)
  }

  initMatriz(rows: number, cols: number): void {
    this.matriz = Array.from({ length: rows }, (_, i) =>
      Array.from({ length: cols }, (_, j) => 0)
    )
    this.currentHeight = rows
    this.currentLenght = cols
    this.updateFormArray()
  }

  get matrizFormArray(): FormArray {
    return this.matrizForm.get("matrizFormArray") as FormArray
  }

  getRowFormArray(rowIndex: number): FormArray {
    return this.matrizFormArray.at(rowIndex) as FormArray
  }

  updateFormArray(): void {
    const formArray = this.formBuilder.array(
      this.matriz.map((row) =>
        this.formBuilder.array(
          row.map((value) =>
            this.formBuilder.control(value, [
              Validators.required,
              this.onlyNumbersValidator(),
            ])
          )
        )
      )
    )
    this.matrizForm.setControl("matrizFormArray", formArray)
  }

  onlyNumbersValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = /^[0-9]+$/.test(control.value)
      return isValid ? null : { onlyNumbers: true }
    }
  }

  disableAllArrows() {
    this.isRightArrowDisabled = false
    this.isLeftArrowDisabled = false
    this.isDownArrowDisabled = false
    this.isUpArrowDisabled = false
  }

  focusNextInput(event: any, lineIndex: number, colIndex: number) {
    if (event.key === "Enter") {
      event.preventDefault()

      if (lineIndex + 1 > this.currentLenght) {
        colIndex++
        lineIndex = -1
      }

      let nextInput = this.elRef.nativeElement.querySelector(
        `input[data-line="${lineIndex}"][data-col="${colIndex + 1}"]`
      )

      if (nextInput == null) {
        nextInput = this.elRef.nativeElement.querySelector(
          `input[data-line="${lineIndex + 1}"][data-col="${0}"]`
        )
      }

      if (nextInput == null) {
        nextInput = this.elRef.nativeElement.querySelector(
          `input[data-line="${0}"][data-col="${0}"]`
        )
      }

      if (nextInput) nextInput.focus()
    }
  }

  checkButton() {
    this.disableAllArrows()
    if (this.currentHeight >= this.maxHeight) this.isDownArrowDisabled = true
    if (this.currentHeight <= this.minHeight) this.isUpArrowDisabled = true
    if (this.currentLenght >= this.maxLenght) this.isRightArrowDisabled = true
    if (this.currentLenght <= this.minLenght) this.isLeftArrowDisabled = true
  }

  handleStartMatriz() {
    this.startMatriz(2)
    this.currentHeight = 2
    this.currentLenght = 2
  }

  handleSizeChange(direction: string) {
    switch (direction) {
      case "arrow-up":
        if (this.isUpArrowDisabled) return
        this.decrementVertical()
        this.currentHeight = this.currentHeight - 1
        break
      case "arrow-down":
        if (this.isDownArrowDisabled) return
        this.incrementVertical()
        this.currentHeight = this.currentHeight + 1
        break
      case "arrow-left":
        if (this.isLeftArrowDisabled) return
        this.decrementHorizontal()
        this.currentLenght = this.currentLenght - 1
        break
      case "arrow-right":
        if (this.isRightArrowDisabled) return
        this.incrementHorizontal()
        this.currentLenght = this.currentLenght + 1
        break
    }
    this.checkButton()
  }

  removeLeadingZeros(control: AbstractControl) {
    
    if (control.value === null || control.value === "") {
      return null
      }

    const regex = /^[0-9]*$/
    if (!regex.test(control.value)) {
      control.setValue(control.value.replace(/[^0-9]/g, ""), { emitEvent: false })
      return
    }
    
    const newValue = control.value.replace(/^0+/, "")
    control.setValue(newValue, { emitEvent: false })
    return
  }

  startMatriz(size: number) {
    this.matriz.forEach((element) => {
      element.push(0)
    })
    for (let i = 0; i < size; i++) {
      this.incrementHorizontal()
      this.incrementVertical()
    }
  }

  incrementHorizontal() {
    this.matriz.forEach((row, rowIndex) => {
      row.push(0)
      ;(this.matrizFormArray.at(rowIndex) as FormArray).push(
        this.formBuilder.control(0, [
          Validators.required,
          this.onlyNumbersValidator(),
        ])
      )
    })
  }

  incrementVertical() {
    const newRow = Array(this.currentLenght).fill(0)
    this.matriz.push(newRow)

    const newFormArray = this.formBuilder.array(
      newRow.map((value) =>
        this.formBuilder.control(value, [
          Validators.required,
          this.onlyNumbersValidator(),
        ])
      )
    )
    this.matrizFormArray.push(newFormArray)
  }

  decrementHorizontal() {
    this.matriz.forEach((row, rowIndex) => {
      row.pop()
      ;(this.matrizFormArray.at(rowIndex) as FormArray).removeAt(row.length)
    })
  }

  decrementVertical() {
    this.matriz.pop()
    this.matrizFormArray.removeAt(this.matriz.length)
  }

  classifyMatrix(matriz: number[][]): MatrixType {
    const rows = matriz.length
    const cols = matriz[0].length

    if (rows === cols) {
      let isNull = true
      let isDiagonal = true
      let isIdentity = true
      let isSymmetric = true
      let isUpperTriangular = true
      let isLowerTriangular = true

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          // Verificar se é uma matriz nula
          if (matriz[i][j] !== 0) {
            isNull = false
          }

          // Verificar se é uma matriz diagonal
          if (i !== j && matriz[i][j] !== 0) {
            isDiagonal = false
          }

          // Verificar se é uma matriz identidade
          if (
            (i === j && matriz[i][j] !== 1) ||
            (i !== j && matriz[i][j] !== 0)
          ) {
            isIdentity = false
          }

          // Verificar se é uma matriz simétrica
          if (matriz[i][j] !== matriz[j][i]) {
            isSymmetric = false
          }

          // Verificar se é uma matriz triangular superior
          if (i > j && matriz[i][j] !== 0) {
            isUpperTriangular = false
          }

          // Verificar se é uma matriz triangular inferior
          if (i < j && matriz[i][j] !== 0) {
            isLowerTriangular = false
          }
        }
      }

      if (isIdentity) return MatrixType.IDENTITY
      if (isDiagonal) return MatrixType.DIAGONAL
      if (isNull) return MatrixType.NULL
      if (isSymmetric) return MatrixType.SYMMETRIC
      if (isUpperTriangular) return MatrixType.UPPER_TRIANGULAR
      if (isLowerTriangular) return MatrixType.LOWER_TRIANGULAR
      return MatrixType.SQUARE
    } else {
      return MatrixType.RECTANGULAR
    }
  }
}
