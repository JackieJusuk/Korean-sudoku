interface TimerProps {
  seconds: number;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function Timer({ seconds }: TimerProps) {
  return (
    <span className="timer" aria-label="경과 시간">
      {formatTime(seconds)}
    </span>
  );
}
