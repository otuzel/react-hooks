// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, {useEffect, useState} from 'react'
import {ErrorBoundary} from 'react-error-boundary'

import {
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
  fetchPokemon,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })

  useEffect(() => {
    //for initial load
    if (!pokemonName) {
      return
    }

    setState({...state, status: 'pending'})

    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState({...state, status: 'resolved', pokemon: pokemonData})
      })
      .catch(error => {
        setState({...state, status: 'rejected', error})
      })
  }, [pokemonName])

  switch (state.status) {
    case 'idle':
      return 'Submit a pokemon'
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      throw state.error
    case 'resolved':
      return <PokemonDataView pokemon={state.pokemon} />
    default:
      return null
  }
}

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {error: false}
//   }

//   static getDerivedStateFromError(error) {
//     return {error}
//   }

//   render() {
//     const {error} = this.state
//     if (error) {
//       return <this.props.FallbackComponent error={error} />
//     }

//     return this.props.children
//   }
// }

const FallbackComponent = props => {
  const {error, resetErrorBoundary} = props
  return (
    <div role="alert">
      There was an error:
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={FallbackComponent}
          onReset={() => setPokemonName('')}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
