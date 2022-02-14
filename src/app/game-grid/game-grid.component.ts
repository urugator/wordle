import { Component, OnInit } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { GameService } from '../game.service';
import { StateService } from '../state.service';

@Component({
  selector: 'app-game-grid',
  templateUrl: './game-grid.component.html',
  styleUrls: ['./game-grid.component.scss']
})
export class GameGridComponent implements OnInit {  
  private keyupListener: EventListener|undefined;

  constructor(public stateService: StateService, public gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.init();
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      this.gameService.input(event.key);
    })
  }

  ngOnDestroy(): void {
    window.removeEventListener('keyup', this.keyupListener!);
  }

  getCorrectnessClass(rowIndex: number, cellIndex: number): Observable<string> {
    const { 
      secretWord$,
      focusedRowIndex$,
      rows$,
    } = this.stateService;
    /*
    // following is wrong, return observable so we can subscribe
    const { value } = rows$.value[rowIndex][cellIndex];    
    if (rowIndex >= focusedRowIndex$.value) {
      // row not submitted yet
      return '';
    }
    if (value === secretWord$.value.charAt(cellIndex)) {
      return 'fullyCorrect';
    } else if (value !== '' && secretWord$.value.includes(value)) {
      return 'partiallyCorrect';
    } else {
      return 'incorrect';
    }
    */
    return combineLatest([
      secretWord$,
      focusedRowIndex$,
      rows$,
    ]).pipe(map(([secretWord, focusedRowIndex, rows]) => {
      if (rowIndex >= focusedRowIndex) {
        // row not submitted yet
        return '';
      }
      const { value } = rows[rowIndex][cellIndex];    
      if (value === secretWord.charAt(cellIndex)) {
        return 'fullyCorrect';
      } else if (value !== '' && secretWord.includes(value)) {
        return 'partiallyCorrect';
      } else {
        return 'incorrect';
      }
    }));
  }  

  isCellFocused(rowIndex: number, cellIndex: number) {
    // {{ rowIndex === (stateService.focusedRowIndex$ | async) && cellIndex === (stateService.focusedCellIndex$ | async) ? 'focus' : '' }}    
    return combineLatest([this.stateService.focusedRowIndex$, this.stateService.focusedCellIndex$])
      .pipe(map((([focusedRowIndex, focusedCellIndex]) => rowIndex === focusedRowIndex && cellIndex === focusedCellIndex)));
  }
}
