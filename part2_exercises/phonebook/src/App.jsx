import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Success from './components/Success'
import Error from './components/Error'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    if(persons.some(item => item.name === newName)) {
      const toReplace = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if(toReplace) {
        const personObject = persons.find(p => p.name === newName)
        const changedPerson = { ...personObject, number: newNumber}

        personService
          .updateNumber(changedPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id === returnedPerson.id ? returnedPerson : person))       
            setSuccessMessage(
              `Updated ${returnedPerson.name}`
            ) 
          })

        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)

      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      }

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(
            `Added ${returnedPerson.name}`
          ) 
        })
      
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
    }
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    const toDelete = window.confirm(`Delete ${person.name}?`)

    if(toDelete) {
      personService
        .deletePerson(id)
        .then(
          setPersons(persons.filter(person => person.id !== id))
        )
        .catch(error => {
          setErrorMessage(
            `Information of ${person} has already removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearchQueryChange = (event) => {
    console.log(event.target.value)
    setSearchQuery(event.target.value)
  }

  const personsToShow = persons.filter(
    person => person.name.toLowerCase().includes(searchQuery)
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Success message={successMessage}/>
      <Error message = {errorMessage}/>

      <Filter 
        searchQuery={searchQuery}
        handleSearchQueryChange={handleSearchQueryChange}
      />

      <h3>add a new</h3>
      
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons
        personsToShow={personsToShow}
        deletePerson={deletePerson}
      />

    </div>
  )
}

export default App