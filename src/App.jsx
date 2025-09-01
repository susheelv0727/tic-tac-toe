import React, { useMemo, useState } from 'react';

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function Square({ value, onClick, highlight, index }) {
  return (
    <button
      onClick={onClick}
      aria-label={`square ${index + 1}`}
      style={{
        padding: '20px',
        margin: '5px',
        fontSize: '24px',
        cursor: 'pointer',
        backgroundColor: highlight ? '#ffeb3b' : '#fff',
        border: '2px solid #333',
        borderRadius: '8px',
      }}
    >
      {value}
    </button>
  );
}

function Board({ squares, onPlay, winningLine, disabled }) {
  function handleClick(i) {
    if (squares[i] || disabled) return;
    onPlay(i);
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 100px)',
        gridTemplateRows: 'repeat(3, 100px)',
        gap: '10px',
        marginTop: '20px',
      }}
    >
      {squares.map((sq, i) => (
        <Square
          key={i}
          value={sq}
          index={i}
          onClick={() => handleClick(i)}
          highlight={Boolean(winningLine && winningLine.includes(i))}
        />
      ))}
    </div>
  );
}

export default function TicTacToeApp() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  const result = useMemo(
    () => calculateWinner(currentSquares),
    [currentSquares]
  );
  const draw = useMemo(
    () => !result && currentSquares.every((s) => s !== null),
    [result, currentSquares]
  );

  function handlePlay(i) {
    if (result || draw) return;
    if (currentSquares[i]) return;

    const next = currentSquares.slice();
    next[i] = xIsNext ? 'X' : 'O';
    const newHistory = [...history.slice(0, currentMove + 1), next];
    setHistory(newHistory);
    setCurrentMove(newHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function reset() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const status = result
    ? `Winner: ${result.winner}`
    : draw
    ? 'Draw!'
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        height: '100vh',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        padding: '20px',
      }}
    >
      <header style={{ marginBottom: '20px' }}>
        <h1>Tic Tac Toe</h1>
        <button
          onClick={reset}
          style={{ padding: '10px 20px', marginTop: '10px' }}
        >
          Reset
        </button>
      </header>
      <main style={{ display: 'flex', gap: '40px' }}>
        <section>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '20px',
            }}
          >
            {status}
          </div>
          <Board
            squares={currentSquares}
            onPlay={handlePlay}
            winningLine={result?.line}
            disabled={Boolean(result || draw)}
          />
        </section>
        <aside>
          <h2>Move History</h2>
          <ol>
            {history.map((_, move) => {
              const isCurrent = move === currentMove;
              const text = move ? `Go to move #${move}` : 'Go to game start';
              return (
                <li key={move}>
                  <button
                    onClick={() => jumpTo(move)}
                    style={{
                      fontWeight: isCurrent ? 'bold' : 'normal',
                      marginBottom: '5px',
                    }}
                  >
                    {isCurrent ? `${text} (current)` : text}
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>
      </main>
    </div>
  );
}
