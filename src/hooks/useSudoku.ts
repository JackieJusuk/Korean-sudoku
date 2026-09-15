import { useCallback, useMemo, useState } from 'react';
import { generatePuzzle } from '../game/generator';
import type { CellPosition, Difficulty, Grid } from '../game/types';
import { findConflicts, isBoardSolved } from '../game/validator';

export function useSudoku(initialDifficulty: Difficulty = 'easy') {
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [puzzle, setPuzzle] = useState(() => generatePuzzle(initialDifficulty));
  const [board, setBoard] = useState<Grid>(() => puzzle.puzzle.map((row) => [...row]));
  const [selected, setSelected] = useState<CellPosition | null>(null);

  const givenMask = useMemo(
    () => puzzle.puzzle.map((row) => row.map((value) => value !== 0)),
    [puzzle],
  );

  const conflicts = useMemo(() => findConflicts(board), [board]);
  const solved = useMemo(() => isBoardSolved(board), [board]);

  const newGame = useCallback((nextDifficulty: Difficulty) => {
    const next = generatePuzzle(nextDifficulty);
    setDifficulty(nextDifficulty);
    setPuzzle(next);
    setBoard(next.puzzle.map((row) => [...row]));
    setSelected(null);
  }, []);

  const selectCell = useCallback(
    (row: number, col: number) => {
      if (givenMask[row][col]) return;
      setSelected({ row, col });
    },
    [givenMask],
  );

  const inputValue = useCallback(
    (value: number) => {
      if (!selected) return;
      const { row, col } = selected;
      if (givenMask[row][col]) return;
      setBoard((prev) => {
        const next = prev.map((r) => [...r]);
        next[row][col] = value;
        return next;
      });
    },
    [selected, givenMask],
  );

  const clearSelected = useCallback(() => inputValue(0), [inputValue]);

  return {
    difficulty,
    board,
    givenMask,
    selected,
    conflicts,
    solved,
    newGame,
    selectCell,
    inputValue,
    clearSelected,
  };
}
