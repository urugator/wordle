import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

type LetterCell = {
  value: string,
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  inputEnabled$ = new BehaviorSubject<boolean>(true); // TODO init with false
  focusedRowIndex$ = new BehaviorSubject<number>(0);
  focusedCellIndex$ = new BehaviorSubject<number>(0);
  columnCount$ = new BehaviorSubject<number>(5);
  rowCount$ = new BehaviorSubject<number>(6);
  secretWord$ = new BehaviorSubject<string>("abcde");
  usedLetters$ = new BehaviorSubject<Array<string>>([]); // maybe map
  rows$ = new BehaviorSubject<Array<Array<LetterCell>>>([]);
  dictionary$ = new BehaviorSubject<Set<string>>(new Set([
    'abcde',
    'edcba',
    'aaaaa',
    'bbbbb',
    'ccccc',
    'ddddd',
    'eeeee',
    'fffff',
  ]));
  
  constructor() { }  
}
