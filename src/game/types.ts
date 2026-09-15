export type Difficulty = 'easy' | 'medium' | 'hard';

export type Grid = number[][];

export interface SudokuPuzzle {
  puzzle: Grid;
  solution: Grid;
  difficulty: Difficulty;
}

export interface CellPosition {
  row: number;
  col: number;
}
