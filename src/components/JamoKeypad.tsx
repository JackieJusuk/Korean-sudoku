import { JAMO_CHARACTERS } from '../game/constants';

interface JamoKeypadProps {
  onInput: (digit: number) => void;
  onClear: () => void;
  disabled?: boolean;
}

export function JamoKeypad({ onInput, onClear, disabled = false }: JamoKeypadProps) {
  return (
    <div className="jamo-keypad" role="group" aria-label="자모 입력 키패드">
      {JAMO_CHARACTERS.map((jamo, i) => (
        <button
          type="button"
          key={jamo}
          className="keypad-key"
          onClick={() => onInput(i + 1)}
          disabled={disabled}
        >
          {jamo}
        </button>
      ))}
      <button
        type="button"
        className="keypad-key keypad-clear"
        onClick={onClear}
        disabled={disabled}
        aria-label="선택한 칸 지우기"
      >
        지우기
      </button>
    </div>
  );
}
