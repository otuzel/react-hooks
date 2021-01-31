// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorage = (
  key,
  initialValue,
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) => {
  const [state, setState] = React.useState(() => {
    const localValue = window.localStorage.getItem(key)
    if (localValue) {
      return deserialize(localValue)
    }
    return initialValue
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current

    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
      prevKeyRef.current = key
    }

    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  // const getInitialName = () => {
  //   return window.localStorage.getItem('name') || initialName
  // }
  // TODO - refactor useLocalStorage to accept ( key, initial)
  // const [name, setName] = useLocalStorage('name', initialName)
  console.log('%c    Child: render start', 'color: MediumSpringGreen')
  const [key, setKey] = React.useState('name')
  const [name, setName] = useLocalStorage(key, initialName)

  React.useEffect(() => {
    setName(name)
  }, [setName, name])

  function handleChange(event) {
    setName(event.target.value)
  }

  function handleClick() {
    if (key === 'name') {
      setKey('firstName')
    } else if (key === 'firstName') {
      setKey('Name')
    } else {
      setKey('name')
    }
  }
  console.log('%c    Child: render end', 'color: red')

  return (
    <div>
      <button type="button" onClick={handleClick}>
        Change key!
      </button>

      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" value={name} />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
