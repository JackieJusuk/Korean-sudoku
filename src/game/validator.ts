import { BOX_SIZE, SIZE } from './constants';
import type { Grid } from './types';

type Cell = [row: number, col: number];

function conflictKey(row: number, col: number): string {
  return `${row},${col}`;
}

function markDuplicates(grid: Grid, cells: Cell[], conflicts: Set<string>): void {
  const seenAt = new Map<number, Cell[]>();
  for (const [row, col] of cells) {
    const value = grid[row][col];
    if (value === 0) continue;
    const existing = seenAt.get(value) ?? [];
    existing.push([row, col]);
    seenAt.set(value, existing);
  }
  for (const positions of seenAt.values()) {
    if (positions.length > 1) {
      for (const [row, col] of positions) conflicts.add(conflictKey(row, col));
    }
  }
}

/** Returns the set of "row,col" keys currently violating a row/column/box rule. */
export function findConflicts(grid: Grid): Set<string> {
  const conflicts = new Set<string>();

  for (let i = 0; i < SIZE; i++) {
    markDuplicates(
      grid,
      Array.from({ length: SIZE }, (_, j) => [i, j] as Cell),
      conflicts,
    );
    markDuplicates(
      grid,
      Array.from({ length: SIZE }, (_, j) => [j, i] as Cell),
      conflicts,
    );
  }

  for (let boxRow = 0; boxRow < SIZE; boxRow += BOX_SIZE) {
    for (let boxCol = 0; boxCol < SIZE; boxCol += BOX_SIZE) {
      const cells: Cell[] = [];
      for (let r = boxRow; r < boxRow + BOX_SIZE; r++) {
        for (let c = boxCol; c < boxCol + BOX_SIZE; c++) cells.push([r, c]);
      }
      markDuplicates(grid, cells, conflicts);
    }
  }

  return conflicts;
}

export function isBoardComplete(grid: Grid): boolean {
  return grid.every((row) => row.every((value) => value !== 0));
}

export function isBoardSolved(grid: Grid): boolean {
  return isBoardComplete(grid) && findConflicts(grid).size === 0;
}
