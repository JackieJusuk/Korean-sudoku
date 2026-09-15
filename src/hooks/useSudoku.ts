import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { generatePuzzle } from '../game/generator';
import type { CellPosition, Difficulty, Grid } from '../game/types';
import { findConflicts, isBoardSolved } from '../game/validator';

export function useSudoku(initialDifficulty: Difficulty = 'easy') {
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [puzzle, setPuzzle] = useState(() => generatePuzzle(initialDifficulty));
  const [board, setBoard] = useState<Grid>(() => puzzle.puzzle.map((row) => [...row]));
  const [selected, setSelected] = useState<CellPosition | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const startedAtRef = useRef(0);
  const generationToken = useRef(0);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  const givenMask = useMemo(
    () => puzzle.puzzle.map((row) => row.map((value) => value !== 0)),
    [puzzle],
  );

  const conflicts = useMemo(() => findConflicts(board), [board]);
  const solved = useMemo(() => isBoardSolved(board), [board]);

  // Puzzle generation can take up to ~1s for hard puzzles. Running it
  // synchronously would freeze the whole UI with no feedback, so it's
  // deferred a tick behind `isGenerating` flipping on, letting a spinner
  // paint first instead of the page silently hanging.
  const newGame = useCallback((nextDifficulty: Difficulty) => {
    const token = ++generationToken.current;
    setDifficulty(nextDifficulty);
    setIsGenerating(true);
    setSelected(null);

    window.setTimeout(() => {
      const next = generatePuzzle(nextDifficulty);
      if (generationToken.current !== token) return; // superseded by a newer request
      setPuzzle(next);
      setBoard(next.puzzle.map((row) => [...row]));
      startedAtRef.current = Date.now();
      setElapsedSeconds(0);
      setIsGenerating(false);
    }, 30);
  }, []);

  useEffect(() => {
    if (solved || isGenerating) return;
    const interval = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [solved, isGenerating]);

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
    isGenerating,
    elapsedSeconds,
    newGame,
    selectCell,
    inputValue,
    clearSelected,
  };
}
