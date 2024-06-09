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
  SQUARE = "Quadrada",
  RECTANGULAR = "Retangular",
  DIAGONAL = "Diagonal",
  IDENTITY = "Identidade",
  NULL = "Nula",
  SYMMETRIC = "Simétrica",
  UPPER_TRIANGULAR = "Triangular Superior",
  LOWER_TRIANGULAR = "Triangular Inferior",
  ROW = "Linha",
  COLUMN = "Coluna",
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

  ngOnInit(): void {}

  handleFormChange(): void {
    this.results.clear()
    this.classifyMatrix()
  }

  initMatriz(rows: number, cols: number): void {
    this.matriz = Array.from({ length: rows }, (_, i) =>
      Array.from({ length: cols }, (_, j) => 0)
      //Array.from({ length: cols }, (_, j) => j + 1 + i * cols)
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
    this.initMatriz(3, 3)
    this.matrizForm.valueChanges.subscribe(() => {
      this.handleFormChange()
    })
    this.classifyMatrix()
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

  handleInputChange(control: AbstractControl) {
    if (control.value === null || control.value === "") {
      return null
    }

    const regex = /^[0-9]*$/
    if (!regex.test(control.value)) {
      control.setValue(control.value.replace(/[^0-9]/g, ""), {
        emitEvent: false,
      })
      return
    }

    const newValue = control.value.replace(/^0+/, "") || "0"
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

  results: Set<MatrixType> = new Set()

  transposeMatrix(matriz: number[][], set?: boolean): number[][] {
    const rows = matriz.length
    const cols = matriz[0].length
    const transposed = Array.from({ length: cols }, () => Array(rows).fill(0))

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        transposed[j][i] = matriz[i][j]
      }
    }

    if (set) {
      this.matrizFormArray.setValue(transposed);
    }

    return transposed
  }

  classifyMatrix() {
    const matriz = this.matrizFormArray.value
    if (!matriz || matriz.length === 0 || matriz[0].length === 0) {
      this.results.clear()
      this.results.add(MatrixType.NULL)
      return
    }

    const rows = matriz.length
    const cols = matriz[0].length

    let isNull = true
    let isDiagonal = true
    let isIdentity = true
    let isSymmetric = false
    let isUpperTriangular = true
    let isLowerTriangular = true
    const transposed = this.transposeMatrix(matriz)

    if (rows === cols) {
      isSymmetric = true
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (matriz[i][j] !== transposed[i][j]) {
            isSymmetric = false
            break
          }
        }
      }
    }

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        //se value for string, converta para numero
        if (typeof matriz[i][j] === "string") {
          matriz[i][j] = parseInt(matriz[i][j])
        }

        const value = matriz[i][j]

        if (value !== 0) {
          isNull = false
        }

        if (i !== j && value !== 0) {
          isDiagonal = false
        }

        if (i === j && value !== 1 || i !== j && value !== 0) {
          isIdentity = false
        }

        if (i > j && value !== 0) {
          isLowerTriangular = false
        }
        
        if (i < j && value !== 0) {
          isUpperTriangular = false
        }
      }
    }

    if (rows === 1) {
      this.results.add(MatrixType.ROW)
    } else {
      this.results.delete(MatrixType.ROW)
    }

    if (cols === 1) {
      this.results.add(MatrixType.COLUMN)
    } else {
      this.results.delete(MatrixType.COLUMN)
    }

    if (isNull) {
      this.results.add(MatrixType.NULL)
    } else {
      this.results.delete(MatrixType.NULL)
    }

    if (isDiagonal) {
      this.results.add(MatrixType.DIAGONAL)
    } else {
      this.results.delete(MatrixType.DIAGONAL)
    }

    if (isIdentity) {
      this.results.add(MatrixType.IDENTITY)
    } else {
      this.results.delete(MatrixType.IDENTITY)
    }

    if (isSymmetric) {
      this.results.add(MatrixType.SYMMETRIC)
    } else {
      this.results.delete(MatrixType.SYMMETRIC)
    }

    if (isUpperTriangular) {
      this.results.add(MatrixType.UPPER_TRIANGULAR)
    } else {
      this.results.delete(MatrixType.UPPER_TRIANGULAR)
    }

    if (isLowerTriangular) {
      this.results.add(MatrixType.LOWER_TRIANGULAR)
    } else {
      this.results.delete(MatrixType.LOWER_TRIANGULAR)
    }

    if (rows === cols) {
      this.results.add(MatrixType.SQUARE)
      this.results.delete(MatrixType.RECTANGULAR)
    } else {
      this.results.add(MatrixType.RECTANGULAR)
      this.results.delete(MatrixType.SQUARE)
    }
  }
}
