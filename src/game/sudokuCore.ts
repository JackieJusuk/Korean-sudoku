import { BOX_SIZE, DIGITS, SIZE } from './constants';
import type { Grid } from './types';

export function createEmptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function canPlace(grid: Grid, row: number, col: number, value: number): boolean {
  for (let i = 0; i < SIZE; i++) {
    if (grid[row][i] === value || grid[i][col] === value) return false;
  }
  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  for (let r = boxRow; r < boxRow + BOX_SIZE; r++) {
    for (let c = boxCol; c < boxCol + BOX_SIZE; c++) {
      if (grid[r][c] === value) return false;
    }
  }
  return true;
}

function findEmptyCell(grid: Grid): [number, number] | null {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) return [r, c];
    }
  }
  return null;
}

function shuffled<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Fills `grid` in place via randomized backtracking. Returns false if unsolvable. */
export function solveGrid(grid: Grid, randomize = false): boolean {
  const empty = findEmptyCell(grid);
  if (!empty) return true;
  const [row, col] = empty;
  const candidates = randomize ? shuffled(DIGITS) : DIGITS;
  for (const value of candidates) {
    if (canPlace(grid, row, col, value)) {
      grid[row][col] = value;
      if (solveGrid(grid, randomize)) return true;
      grid[row][col] = 0;
    }
  }
  return false;
}

export function generateSolvedGrid(): Grid {
  const grid = createEmptyGrid();
  solveGrid(grid, true);
  return grid;
}

/** Counts solutions up to `limit`, stopping early once reached (used for uniqueness checks). */
export function countSolutions(grid: Grid, limit = 2): number {
  const empty = findEmptyCell(grid);
  if (!empty) return 1;
  const [row, col] = empty;
  let count = 0;
  for (const value of DIGITS) {
    if (count >= limit) break;
    if (canPlace(grid, row, col, value)) {
      grid[row][col] = value;
      count += countSolutions(grid, limit - count);
      grid[row][col] = 0;
    }
  }
  return count;
}

/**
 * Removes values from a solved grid while keeping the solution unique,
 * stopping once `targetGivens` remain (or no more cells can be removed safely).
 */
export function digHoles(solved: Grid, targetGivens: number): Grid {
  const puzzle = solved.map((row) => [...row]);
  const positions = shuffled(Array.from({ length: SIZE * SIZE }, (_, i) => i));
  let givens = SIZE * SIZE;

  for (const pos of positions) {
    if (givens <= targetGivens) break;
    const row = Math.floor(pos / SIZE);
    const col = pos % SIZE;
    if (puzzle[row][col] === 0) continue;

    const backup = puzzle[row][col];
    puzzle[row][col] = 0;

    const probe = puzzle.map((r) => [...r]);
    if (countSolutions(probe, 2) === 1) {
      givens--;
    } else {
      puzzle[row][col] = backup;
    }
  }

  return puzzle;
}
