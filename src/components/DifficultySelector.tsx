import type { Difficulty } from '../game/types';

const OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: '쉬움' },
  { value: 'medium', label: '보통' },
  { value: 'hard', label: '어려움' },
];

interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

export function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  return (
    <div className="difficulty-selector" role="radiogroup" aria-label="난이도 선택">
      {OPTIONS.map((option) => (
        <button
          type="button"
          key={option.value}
          role="radio"
          aria-checked={value === option.value}
          className={`difficulty-option${value === option.value ? ' active' : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
