import { Board } from './components/Board';
import { DifficultySelector } from './components/DifficultySelector';
import { JamoKeypad } from './components/JamoKeypad';
import { useSudoku } from './hooks/useSudoku';

function App() {
  const {
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
  } = useSudoku('easy');

  return (
    <div className="app">
      <header className="app-header">
        <h1>한글 자모 수도쿠</h1>
        <DifficultySelector value={difficulty} onChange={newGame} />
      </header>

      <main className="app-main">
        <Board
          board={board}
          givenMask={givenMask}
          selected={selected}
          conflicts={conflicts}
          onSelectCell={selectCell}
        />

        {solved && (
          <p className="solved-banner" role="status">
            완성했어요! 🎉
          </p>
        )}

        <JamoKeypad onInput={inputValue} onClear={clearSelected} disabled={!selected} />

        <button type="button" className="new-game-button" onClick={() => newGame(difficulty)}>
          새 게임
        </button>
      </main>
    </div>
  );
}

export default App;
