import { Component, ElementRef, LOCALE_ID } from "@angular/core"
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

enum MatrizType {
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

enum MatrizExplanation {
  SQUARE = "Uma matriz quadrada possui o mesmo número de linhas e colunas.",
  RECTANGULAR = "Uma matriz retangular possui um número diferente de linhas e colunas.",
  DIAGONAL = "Uma matriz diagonal possui zeros em todas as posições fora da diagonal principal.",
  IDENTITY = "Uma matriz identidade é uma matriz diagonal com todos os elementos da diagonal principal iguais a 1.",
  NULL = "Uma matriz nula possui todos os elementos iguais a zero.",
  SYMMETRIC = "Uma matriz simétrica é igual à sua transposta.",
  UPPER_TRIANGULAR = "Uma matriz triangular superior possui todos os elementos abaixo da diagonal principal iguais a zero.",
  LOWER_TRIANGULAR = "Uma matriz triangular inferior possui todos os elementos acima da diagonal principal iguais a zero.",
  ROW = "Uma matriz de uma linha possui apenas uma linha.",
  COLUMN = "Uma matriz de uma coluna possui apenas uma coluna.",
}

import localePt from "@angular/common/locales/pt"
import { registerLocaleData } from "@angular/common"

registerLocaleData(localePt)

@Component({
  selector: "app-matriz",
  templateUrl: "./matriz.component.html",
  providers: [{ provide: LOCALE_ID, useValue: "pt" }],
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
  isMatrizStarted: boolean = false

  matrizForm: FormGroup

  determinant: null | number = null

  constructor(private formBuilder: FormBuilder, private elRef: ElementRef) {
    this.matrizForm = this.formBuilder.group({
      matrizFormArray: this.formBuilder.array([]),
    })
  }

  ngOnInit(): void {}

  handleFormChange(): void {
    this.results.clear()
    this.classifyMatriz()
    this.determinant = null
  }

  initMatriz(rows: number, cols: number): void {
    this.matriz = Array.from(
      { length: rows },
      (_, i) => Array.from({ length: cols }, (_, j) => 0)
      //Array.from({ length: cols }, (_, j) => j + 1 + i * cols)
    )
    this.currentHeight = rows
    this.currentLenght = cols
    this.updateFormArray()
  }

  classificationInfo: string = ""
  handleClassificationInfo(type: MatrizType) {
    switch (type) {
      case MatrizType.SQUARE:
        this.classificationInfo = MatrizExplanation.SQUARE
        break
      case MatrizType.RECTANGULAR:
        this.classificationInfo = MatrizExplanation.RECTANGULAR
        break
      case MatrizType.DIAGONAL:
        this.classificationInfo = MatrizExplanation.DIAGONAL
        break
      case MatrizType.IDENTITY:
        this.classificationInfo = MatrizExplanation.IDENTITY
        break
      case MatrizType.NULL:
        this.classificationInfo = MatrizExplanation.NULL
        break
      case MatrizType.SYMMETRIC:
        this.classificationInfo = MatrizExplanation.SYMMETRIC
        break
      case MatrizType.UPPER_TRIANGULAR:
        this.classificationInfo = MatrizExplanation.UPPER_TRIANGULAR
        break
      case MatrizType.LOWER_TRIANGULAR:
        this.classificationInfo = MatrizExplanation.LOWER_TRIANGULAR
        break
      case MatrizType.ROW:
        this.classificationInfo = MatrizExplanation.ROW
        break
      case MatrizType.COLUMN:
        this.classificationInfo = MatrizExplanation.COLUMN
        break
      default:
        this.classificationInfo = ""
    }
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
    this.classifyMatriz()
    this.isMatrizStarted = true
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
    // Regex para validar números inteiros positivos ou negativos
    const regex = /^-?\d*$/

    // Verifica se o valor do controle corresponde à expressão regular
    if (!regex.test(control.value)) {
      // Remove todos os caracteres que não são dígitos ou o sinal de menos (para números negativos)
      control.setValue(control.value.replace(/[^-\d]/g, ""), {
        emitEvent: false,
      })
      return
    }

    // Remove zeros à esquerda, exceto se o número for zero absoluto
    const newValue = control.value.replace(/^(-?)0+(?=\d)|^(-?)0+(?=$)/, "$1$2")
    control.setValue(newValue, { emitEvent: false })
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

  results: Set<MatrizType> = new Set()

  transposeMatriz(matriz: number[][], set?: boolean): number[][] {
    const rows = matriz.length
    const cols = matriz[0].length
    const transposed = Array.from({ length: cols }, () => Array(rows).fill(0))

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        transposed[j][i] = matriz[i][j]
      }
    }

    if (set) {
      this.matrizFormArray.setValue(transposed)
    }

    return transposed
  }

  fillWithOnes(matriz: number[][]) {
    const rows = matriz.length
    const cols = matriz[0].length

    const ones = Array.from({ length: rows }, () => Array(cols).fill(1))

    this.matrizFormArray.setValue(ones)
  }

  resetMatriz(matriz: number[][]) {
    const rows = matriz.length
    const cols = matriz[0].length

    const empty = Array.from({ length: cols }, () => Array(rows).fill(0))

    this.matrizFormArray.setValue(empty)
  }

  enlargeMatriz(matriz: number[][]) {
    const rows = matriz.length
    const cols = matriz[0].length

    let targetHeight = 0
    let targetWidth = 0

    console.log(rows, cols)

    if (rows < 8 || cols < 8) {
      targetHeight = 8
      targetWidth = 8
      for (let i = rows; i < targetHeight; i++) {
        this.incrementVertical()
      }
      for (let i = cols; i < targetWidth; i++) {
        this.incrementHorizontal()
      }
    }
    else {
      targetHeight = 3
      targetWidth = 3
      for (let i = rows; i > targetHeight; i--) {
        this.decrementVertical()
      }
      for (let i = cols; i > targetWidth; i--) {
        this.decrementHorizontal()
      }
    }

    this.currentHeight = targetHeight
    this.currentLenght = targetWidth
  }

  calculateDeterminant(matriz: number[][]): number {
    if (matriz.length !== matriz[0].length) {
      return 0
    }

    const size = matriz.length

    if (size === 1) {
      return matriz[0][0]
    }

    if (size === 2) {
      return matriz[0][0] * matriz[1][1] - matriz[0][1] * matriz[1][0]
    }

    this.determinant = 0

    for (let j = 0; j < size; j++) {
      this.determinant +=
        matriz[0][j] *
        this.calculateCofactor(matriz, 0, j) *
        (j % 2 === 0 ? 1 : -1)
    }

    return this.determinant
  }

  calculateCofactor(matriz: number[][], row: number, col: number): number {
    const subMatriz: number[][] = []

    for (let i = 1; i < matriz.length; i++) {
      const newRow: number[] = []
      for (let j = 0; j < matriz[i].length; j++) {
        if (j !== col) {
          newRow.push(matriz[i][j])
        }
      }
      subMatriz.push(newRow)
    }

    return this.calculateDeterminant(subMatriz)
  }

  classifyMatriz() {
    const matriz = this.matrizFormArray.value
    if (!matriz || matriz.length === 0 || matriz[0].length === 0) {
      this.results.clear()
      this.results.add(MatrizType.NULL)
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
    const transposed = this.transposeMatriz(matriz)

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

        if ((i === j && value !== 1) || (i !== j && value !== 0)) {
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
      this.results.add(MatrizType.ROW)
    } else {
      this.results.delete(MatrizType.ROW)
    }

    if (cols === 1) {
      this.results.add(MatrizType.COLUMN)
    } else {
      this.results.delete(MatrizType.COLUMN)
    }

    if (isNull) {
      this.results.add(MatrizType.NULL)
    } else {
      this.results.delete(MatrizType.NULL)
    }

    if (isDiagonal) {
      this.results.add(MatrizType.DIAGONAL)
    } else {
      this.results.delete(MatrizType.DIAGONAL)
    }

    if (isIdentity) {
      this.results.add(MatrizType.IDENTITY)
    } else {
      this.results.delete(MatrizType.IDENTITY)
    }

    if (isSymmetric) {
      this.results.add(MatrizType.SYMMETRIC)
    } else {
      this.results.delete(MatrizType.SYMMETRIC)
    }

    if (isUpperTriangular) {
      this.results.add(MatrizType.UPPER_TRIANGULAR)
    } else {
      this.results.delete(MatrizType.UPPER_TRIANGULAR)
    }

    if (isLowerTriangular) {
      this.results.add(MatrizType.LOWER_TRIANGULAR)
    } else {
      this.results.delete(MatrizType.LOWER_TRIANGULAR)
    }

    if (rows === cols) {
      this.results.add(MatrizType.SQUARE)
      this.results.delete(MatrizType.RECTANGULAR)
    } else {
      this.results.add(MatrizType.RECTANGULAR)
      this.results.delete(MatrizType.SQUARE)
    }
  }
}
