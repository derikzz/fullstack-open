const Hello = (props) => {
  console.log(props)
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Derik'
  const age = 18
  return (
    <>
      <Hello name={name} age={age} />
      <Hello name='Greysun' age={18} />
      <Hello name='Euan' age={10+8} />
    </>
  )
}

export default App