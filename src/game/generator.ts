import { digHoles, generateSolvedGrid } from './sudokuCore';
import type { Difficulty, SudokuPuzzle } from './types';

// Approximate number of starting clues (out of 81 cells) per difficulty.
const GIVENS_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 38,
  medium: 30,
  hard: 24,
};

export function generatePuzzle(difficulty: Difficulty): SudokuPuzzle {
  const solution = generateSolvedGrid();
  const puzzle = digHoles(solution, GIVENS_BY_DIFFICULTY[difficulty]);
  return { puzzle, solution, difficulty };
}
