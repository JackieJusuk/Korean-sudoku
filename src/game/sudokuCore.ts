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

interface CandidateCell {
  row: number;
  col: number;
  candidates: number[];
}

/**
 * Finds the empty cell with the fewest legal candidates ("minimum remaining
 * values" heuristic). Branching on this cell first — instead of the first
 * empty cell found — keeps backtracking searches from blowing up on sparse
 * grids, which matters a lot for `countSolutions` on a near-final puzzle.
 */
function findMinCandidateCell(grid: Grid): CandidateCell | null {
  let best: CandidateCell | null = null;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] !== 0) continue;
      const candidates = DIGITS.filter((d) => canPlace(grid, r, c, d));
      if (!best || candidates.length < best.candidates.length) {
        best = { row: r, col: c, candidates };
        if (candidates.length <= 1) return best; // can't do better than a forced/dead cell
      }
    }
  }
  return best;
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

/**
 * Counts solutions up to `limit`, stopping early once reached (used for
 * uniqueness checks). Uses the minimum-remaining-candidates heuristic to
 * keep branching small, plus a hard node budget so a single check can never
 * hang — if the budget is exhausted, returns `limit + 1` (a value that can
 * never equal a real solution count) so callers treat it as "not verified
 * unique" rather than risking a false positive.
 */
export function countSolutions(grid: Grid, limit = 2, nodeBudget = 20000): number {
  let nodes = 0;
  let budgetExceeded = false;

  function search(remainingLimit: number): number {
    if (budgetExceeded) return 0;
    if (++nodes > nodeBudget) {
      budgetExceeded = true;
      return 0;
    }

    const cell = findMinCandidateCell(grid);
    if (!cell) return 1; // fully filled: one solution along this branch
    if (cell.candidates.length === 0) return 0; // dead end

    let count = 0;
    for (const value of cell.candidates) {
      if (count >= remainingLimit) break;
      grid[cell.row][cell.col] = value;
      count += search(remainingLimit - count);
      grid[cell.row][cell.col] = 0;
      if (budgetExceeded) break;
    }
    return count;
  }

  const count = search(limit);
  return budgetExceeded ? limit + 1 : count;
}

/**
 * Removes cells from a solved grid one at a time (in random order), keeping
 * the solution unique at every step, until `minGivens` remain or no more
 * cells can be removed safely. Returns the cells in the order they were
 * removed, so any prefix of the result is itself a valid unique-solution
 * puzzle — letting callers reconstruct puzzles at any givens count between
 * 81 and the final count from a single dig.
 */
export function digHolesOrdered(solved: Grid, minGivens: number): [row: number, col: number][] {
  const puzzle = solved.map((row) => [...row]);
  const positions = shuffled(Array.from({ length: SIZE * SIZE }, (_, i) => i));
  const removalOrder: [number, number][] = [];
  let givens = SIZE * SIZE;

  for (const pos of positions) {
    if (givens <= minGivens) break;
    const row = Math.floor(pos / SIZE);
    const col = pos % SIZE;
    if (puzzle[row][col] === 0) continue;

    const backup = puzzle[row][col];
    puzzle[row][col] = 0;

    const probe = puzzle.map((r) => [...r]);
    if (countSolutions(probe, 2) === 1) {
      givens--;
      removalOrder.push([row, col]);
    } else {
      puzzle[row][col] = backup;
    }
  }

  return removalOrder;
}

/** Rebuilds the puzzle state after applying the first `removeCount` removals from `order`. */
export function applyRemovalOrder(
  solved: Grid,
  order: readonly [row: number, col: number][],
  removeCount: number,
): Grid {
  const puzzle = solved.map((row) => [...row]);
  const count = Math.min(removeCount, order.length);
  for (let i = 0; i < count; i++) {
    const [row, col] = order[i];
    puzzle[row][col] = 0;
  }
  return puzzle;
}
