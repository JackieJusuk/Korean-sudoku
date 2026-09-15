import { BOX_SIZE, DIGITS, SIZE } from './constants';
import type { Grid } from './types';

type CellRef = [row: number, col: number];

function candidatesAt(grid: Grid, row: number, col: number): number[] {
  const used = new Set<number>();
  for (let i = 0; i < SIZE; i++) {
    used.add(grid[row][i]);
    used.add(grid[i][col]);
  }
  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  for (let r = boxRow; r < boxRow + BOX_SIZE; r++) {
    for (let c = boxCol; c < boxCol + BOX_SIZE; c++) used.add(grid[r][c]);
  }
  return DIGITS.filter((d) => !used.has(d));
}

function collectUnits(): CellRef[][] {
  const units: CellRef[][] = [];
  for (let i = 0; i < SIZE; i++) {
    units.push(Array.from({ length: SIZE }, (_, j) => [i, j]));
    units.push(Array.from({ length: SIZE }, (_, j) => [j, i]));
  }
  for (let boxRow = 0; boxRow < SIZE; boxRow += BOX_SIZE) {
    for (let boxCol = 0; boxCol < SIZE; boxCol += BOX_SIZE) {
      const cells: CellRef[] = [];
      for (let r = boxRow; r < boxRow + BOX_SIZE; r++) {
        for (let c = boxCol; c < boxCol + BOX_SIZE; c++) cells.push([r, c]);
      }
      units.push(cells);
    }
  }
  return units;
}

const UNITS = collectUnits();

/** "Naked single": a cell with exactly one remaining candidate. */
function applyNakedSingles(grid: Grid): boolean {
  let progress = false;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] !== 0) continue;
      const candidates = candidatesAt(grid, r, c);
      if (candidates.length === 1) {
        grid[r][c] = candidates[0];
        progress = true;
      }
    }
  }
  return progress;
}

/** "Hidden single": a digit that can only go in one cell within a row/column/box. */
function applyHiddenSingles(grid: Grid): boolean {
  let progress = false;
  for (const unit of UNITS) {
    for (const digit of DIGITS) {
      let spot: CellRef | null = null;
      let count = 0;
      for (const [r, c] of unit) {
        if (grid[r][c] !== 0) continue;
        if (candidatesAt(grid, r, c).includes(digit)) {
          count++;
          spot = [r, c];
          if (count > 1) break;
        }
      }
      if (count === 1 && spot) {
        const [r, c] = spot;
        grid[r][c] = digit;
        progress = true;
      }
    }
  }
  return progress;
}

function reduceByLogic(grid: Grid): void {
  let progress = true;
  while (progress) {
    progress = applyNakedSingles(grid) || applyHiddenSingles(grid);
  }
}

/**
 * Solves as far as basic human techniques (naked/hidden singles) can go without
 * guessing, then returns how many cells are still empty. 0 means the puzzle is
 * "easy" (pure logic); a larger gap means solving it requires deeper deduction
 * or trial-and-error, i.e. a harder puzzle.
 */
export function logicalSolveGap(puzzle: Grid): number {
  const grid = puzzle.map((row) => [...row]);
  reduceByLogic(grid);
  let empty = 0;
  for (const row of grid) {
    for (const value of row) if (value === 0) empty++;
  }
  return empty;
}

/**
 * After exhausting naked/hidden singles, counts how many trial-and-error
 * placements (including dead-end branches) a backtracking solver needs to
 * finish the puzzle. 0 means it never has to guess (pure logic); higher
 * counts mean more ambiguity, i.e. a harder puzzle to solve by hand.
 */
export function estimateSearchSteps(puzzle: Grid, stepCap = 3000): number {
  const grid = puzzle.map((row) => [...row]);
  reduceByLogic(grid);

  let steps = 0;

  function findEmptyCell(): CellRef | null {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] === 0) return [r, c];
      }
    }
    return null;
  }

  function backtrack(): boolean {
    if (steps >= stepCap) return true;
    const empty = findEmptyCell();
    if (!empty) return true;
    const [row, col] = empty;
    for (const value of candidatesAt(grid, row, col)) {
      if (steps >= stepCap) return true;
      steps++;
      grid[row][col] = value;
      if (backtrack()) return true;
      grid[row][col] = 0;
    }
    return false;
  }

  backtrack();
  return steps;
}
