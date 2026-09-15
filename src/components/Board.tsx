import { digitToJamo } from '../game/constants';
import type { CellPosition, Grid } from '../game/types';

interface BoardProps {
  board: Grid;
  givenMask: boolean[][];
  selected: CellPosition | null;
  conflicts: Set<string>;
  onSelectCell: (row: number, col: number) => void;
}

export function Board({ board, givenMask, selected, conflicts, onSelectCell }: BoardProps) {
  return (
    <div className="sudoku-board" role="grid" aria-label="자모 수도쿠 보드">
      {board.map((row, r) => (
        <div className="sudoku-row" role="row" key={r}>
          {row.map((value, c) => {
            const isGiven = givenMask[r][c];
            const isSelected = selected?.row === r && selected?.col === c;
            const isConflict = conflicts.has(`${r},${c}`);
            const boxShade = (Math.floor(r / 3) + Math.floor(c / 3)) % 2 === 1;

            const classNames = ['sudoku-cell'];
            if (isGiven) classNames.push('given');
            if (isSelected) classNames.push('selected');
            if (isConflict) classNames.push('conflict');
            if (boxShade) classNames.push('box-shade');
            if (c % 3 === 0) classNames.push('border-left-thick');
            if (r % 3 === 0) classNames.push('border-top-thick');
            if (c === 8) classNames.push('border-right-thick');
            if (r === 8) classNames.push('border-bottom-thick');

            return (
              <button
                type="button"
                key={c}
                role="gridcell"
                className={classNames.join(' ')}
                onClick={() => onSelectCell(r, c)}
                aria-selected={isSelected}
                aria-readonly={isGiven}
                disabled={isGiven}
              >
                {digitToJamo(value)}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
