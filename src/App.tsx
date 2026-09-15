import { Board } from './components/Board';
import { DifficultySelector } from './components/DifficultySelector';
import { JamoKeypad } from './components/JamoKeypad';
import { Timer } from './components/Timer';
import { useSudoku } from './hooks/useSudoku';

function App() {
  const {
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
  } = useSudoku('easy');

  const interactionDisabled = isGenerating || solved;

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            ㄱㄴㄷ
          </span>
          <h1>한글 자모 수도쿠</h1>
        </div>
        <DifficultySelector value={difficulty} onChange={newGame} disabled={isGenerating} />
      </header>

      <main className="app-main">
        <div className="status-row">
          <Timer seconds={elapsedSeconds} />
          <button
            type="button"
            className="new-game-button"
            onClick={() => newGame(difficulty)}
            disabled={isGenerating}
          >
            새 게임
          </button>
        </div>

        <div className="board-wrap">
          <Board
            board={board}
            givenMask={givenMask}
            selected={selected}
            conflicts={conflicts}
            onSelectCell={selectCell}
            disabled={interactionDisabled}
          />

          {isGenerating && (
            <div className="board-overlay" role="status" aria-live="polite">
              <span className="spinner" aria-hidden="true" />
              <span>퍼즐 만드는 중…</span>
            </div>
          )}

          {!isGenerating && solved && (
            <div className="board-overlay solved-overlay" role="status">
              <span aria-hidden="true">🎉</span>
              <span>완성했어요!</span>
            </div>
          )}
        </div>

        <JamoKeypad onInput={inputValue} onClear={clearSelected} disabled={!selected || interactionDisabled} />
      </main>
    </div>
  );
}

export default App;
