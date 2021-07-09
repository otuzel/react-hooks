// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

const App = () => {
  return <Game />
}

const Board = props => {
  const {squares, selectSquare} = props

  const renderSquare = i => {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
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
    </div>
  )
}

const Game = () => {
  //Lazy initialization
  // const [squares, setSquares] = useLocalStorageState(
  //   'tictactoe',
  //   Array(9).fill(null),
  // )
  const [history, setHistory] = useLocalStorageState('tictactoe:history', [
    Array(9).fill(null),
  ])

  const [activeStep, setActiveStep] = useLocalStorageState(
    'tictactoe:activeStep',
    0,
  )
  const currentSquares = history[activeStep]
  // const [squares, setSquares] = React.useState(
  //   () => JSON.parse(localStorage.getItem('tictactoe')) || Array(9).fill(null),
  // )

  // eslint-disable-next-line no-unused-vars
  function calculateNextValue(squares) {
    return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
  }

  const selectSquare = index => {
    if (calculateWinner(currentSquares) || currentSquares[index]) {
      return
    }

    const newHistory = history.slice(0, activeStep + 1)
    const newSquares = [
      ...currentSquares.slice(0, index),
      nextValue,
      ...currentSquares.slice(index + 1),
    ]

    // setSquares(newSquares)
    setHistory([...newHistory, newSquares])
    setActiveStep(newHistory.length)
  }

  const restart = () => {
    // setSquares(Array(9).fill(null))
    setHistory([Array(9).fill(null)])
    setActiveStep(0)
  }

  // eslint-disable-next-line no-unused-vars
  const calculateStatus = (winner, squares, nextValue) => {
    return winner
      ? `Winner: ${winner}`
      : squares.every(Boolean)
      ? `Scratch: Cat's game`
      : `Next player: ${nextValue}`
  }

  // eslint-disable-next-line no-unused-vars
  // const calculateNextValue = squares => {
  //   const xSquaresCount = squares.filter(r => r === 'X').length
  //   const oSquaresCount = squares.filter(r => r === 'O').length
  //   return oSquaresCount === xSquaresCount ? 'X' : 'O'
  // }

  // eslint-disable-next-line no-unused-vars
  const calculateWinner = squares => {
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
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a]
      }
    }
    return null
  }

  const goToStep = (e, index) => {
    // setSquares(history[index])
    setActiveStep(index)
  }

  // DERIVE STATES ON THE FLY
  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  // NO GOOD APPROACH - REASON BELOW
  // const [nextValue, setNextValue] = React.useState('X')
  // const [winner, setWinner] = React.useState(null)

  // THIS APPROACH IS HARD TO MANAGE AND KEEP STATES SYNC TOGETHER
  // ALSO CAUSES UNNECESSARY RENDERS
  // React.useEffect(() => {
  //   setNextValue(calculateNextValue(squares))
  //   setWinner(calculateWinner(squares))
  // }, [squares])

  return (
    <div className="game">
      <div className="game-board">
        <Board selectSquare={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>
          {status} {activeStep}
        </div>
        <div>
          <ol>
            {}
            {/* <li>
              <button
                disabled={history.length === 0}
                onClick={() => {
                  setActiveStep(0)
                }}
              >
                Go to game start {activeStep === 0 ? '(current)' : null}
              </button>
            </li> */}
            {history.map((step, index) => (
              <li key={index}>
                <button
                  disabled={activeStep === index}
                  onClick={e => {
                    goToStep(e, index)
                    setActiveStep(index)
                  }}
                >
                  {index === 0 ? `Go to start` : `Go to move # ${index + 1}`}
                  {activeStep === index ? `(current)` : ''}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

export default App
