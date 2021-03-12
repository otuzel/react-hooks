// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board(props) {
  const {onAddHistory} = props

  // Lazy initialization
  const [squares, setSquares] = useLocalStorageState(
    'tictactoe',
    Array(9).fill(null),
  )
  // const [squares, setSquares] = React.useState(
  //   () => JSON.parse(localStorage.getItem('tictactoe')) || Array(9).fill(null),
  // )

  // DERIVE STATES ON THE FLY
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  // NO GOOD APPROACH - REASON BELOW
  // const [nextValue, setNextValue] = React.useState('X')
  // const [winner, setWinner] = React.useState(null)

  // THIS APPROACH IS HARD TO MANAGE AND KEEP STATES SYNC TOGETHER
  // ALSO CAUSES UNNECESSARY RENDERS
  // React.useEffect(() => {
  //   setNextValue(calculateNextValue(squares))
  //   setWinner(calculateWinner(squares))
  // }, [squares])

  function selectSquare(index) {
    if (calculateWinner(squares) || squares[index]) {
      return
    }

    const newSquares = [
      ...squares.slice(0, index),
      nextValue,
      ...squares.slice(index + 1),
    ]

    setSquares(newSquares)
    onAddHistory(newSquares)
  }

  function restart() {
    setSquares(Array(9).fill(null))
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        Restart
      </button>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
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
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

function Game() {
  const [history, setHistory] = React.useState([])

  const onAddHistory = step => {
    setHistory([...history, step])
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onAddHistory={onAddHistory} />
      </div>
      <div className="game-board">
        <GameInfo history={history} />
      </div>
    </div>
  )
}
function GameInfo(props) {
  const {history} = props

  console.log({history})

  return (
    <div>
      <ol>
        {history.map((step, index) => (
          <li>
            <button>
              {index === 0 ? `Go to game start` : `Go to move # ${index}`}
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default App
