import { Injectable } from '@angular/core';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private stateService: StateService) { }

  init() {
    const { rows$, rowCount$, columnCount$ } = this.stateService;
    const rows = Array(rowCount$.value).fill(null).map(_ => {
      return Array(columnCount$.value).fill(null).map(_ => {
        return { value: '' }
      })
    }); 
    rows$.next(rows);
  }

  input(key: string) {
    const { 
      inputEnabled$,
    } = this.stateService;
    if (!inputEnabled$.value) {
      return;
    }
    if (key.length === 1) {
      this.typeLetter(key);
    } else if (key === 'Delete') {
      this.clearFocusedCell();
    } else if (key === 'Backspace') {
      this.clearFocusedCell();
      this.moveFocusToPrevCell();
    } else if (key === 'ArrowLeft') {
      this.moveFocusToPrevCell();
    } else if (key === 'ArrowRight') {
      this.moveFocusToNextCell();
    } else if (key === 'Enter') {
      this.submitRow();
    }    
  }

  private clearFocusedCell() {
    const { 
      focusedRowIndex$,
      focusedCellIndex$,
      rows$,      
    } = this.stateService;
    const row = rows$.value[focusedRowIndex$.value];
    const cell = row[focusedCellIndex$.value];
    cell.value = '';
    rows$.next(rows$.value);
  }

  private moveFocusToPrevCell() {
    const {     
      focusedCellIndex$,    
    } = this.stateService;
    if (focusedCellIndex$.value === 0) {
      return;
    }
    focusedCellIndex$.next(focusedCellIndex$.value - 1);
  }

  private moveFocusToNextCell() {
    const {
      focusedCellIndex$,
      rows$,
    } = this.stateService;
    if (focusedCellIndex$.value === rows$.value.length - 1) {
      return;
    }
    focusedCellIndex$.next(focusedCellIndex$.value + 1);
  }

  private submitRow() {
    const { 
      focusedRowIndex$,
      focusedCellIndex$,
      rows$,
      dictionary$,
      secretWord$,
    } = this.stateService;
    // 
    const row = rows$.value[focusedRowIndex$.value];
    // All cells must contain non-white char
    for (const cell of row) {
      if (/^\s?$/.test(cell.value)) {
        console.log(`Can't submit row: all cells must contain char. TODO shake`);
        return;
      }
    }
    // The word must be in dictionary
    const word = row.map(cell => cell.value).join('');
    if (!dictionary$.value.has(word)) {
      console.log(`Can't submit row: word is not in dictionary. TODO shake + display msg`);
      return;
    }
    // reveal
    for (const cell of row) {
      // TODO play animation for each cell      
    }
    // conclude
    if (word === secretWord$.value) {
      // success
      // TODO      
    } if (focusedRowIndex$.value === rows$.value.length - 1) {
      // fail
      // TODO 
    } else {
      // move to next row
      focusedRowIndex$.next(focusedRowIndex$.value + 1);
      focusedCellIndex$.next(0);
    }        
  }

  /**
   * Types letter to currently focused field and moves cursor to next field   
   */
  private typeLetter(letter: string) {
    console.log(letter);
    if (letter.length > 1) {
      throw new Error(`Letter must be single character.`);
    }
    if (!this.stateService.inputEnabled$) {
      throw new Error(`Typing is not possible at this point.`);
    }    
    const { 
      focusedRowIndex$,
      focusedCellIndex$,
      rows$
    } = this.stateService;     
    const row = rows$.value[focusedRowIndex$.value];
    const cell = row[focusedCellIndex$.value];    
    // Update value
    cell.value = letter;    
    rows$.next(rows$.value); // not necessary how so?
    // Move focus    
    if (focusedCellIndex$.value < row.length - 1) {
      focusedCellIndex$.next(focusedCellIndex$.value + 1);
    }
  }
}
