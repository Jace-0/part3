import { useEffect } from 'react'
import { useState } from 'react'
import phoneService from './services/phonebook'

const Filter = ({searchTerm, handleSearchChange}) => {
  return (
    <div>
        filter shown with : <input value={searchTerm} onChange={handleSearchChange}/>
    </div>
  )
}

const PersonForm = ({addPerson, newName, handleNameChange, newNumber, handleNumberChange}) =>{
  return(
    <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>

          <br/>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
 }

const Persons = ({persons, onDelete}) => {
  return(
    <div>
    {persons.map(person => (
      <div key={person.id}>
        {person.name} {person.number}
        <button onClick={() => onDelete(person.id)}>delete</button>
      </div>
    )
      )}
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  const isError = message.includes('has already been removed from the server')
  const className = `notif ${isError ? 'error' : 'success'}`

  return (
    <div className={`notif ${className}`}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    phoneService
      .getAll()
      .then(initialResource => {
        setPersons(initialResource)
      })
  }, [])

  // console.log('render', persons.length, 'notes')

  // add persons
  const addPerson = (event) => {
    event.preventDefault()
    const newPersonObject = {
      // id : String(persons.length + 1),
      name : newName,
      number : newNumber
    }

    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one ?`)) {
        const person = persons.find(p => p.name ===newName)

        // update person object
        phoneService
          .update(person.id, newPersonObject)
          .then(returnedObject => {
            console.log('Returned object:', returnedObject)
            setPersons(persons.map(p => p.id !== person.id ? p : returnedObject ))
            setNewName('')
            setNewNumber('')

            // set notification
            setNotification(`Updated ${newName}`)

            //  set timeout
            setTimeout(() => {
              setNotification(null)
            }, 5000)

          })
          .catch(error => {
            console.log('failed to update', error)
            // set notification

            setNotification(`Information of ${newName} has already been removed from the server`)
            
            //  set timeout
            setTimeout(() => {
              setNotification(null)
            }, 5000)

          }) 
      }
    }

    // create a new person object
    else {
      phoneService
        .create(newPersonObject)
        .then(returnedResource => {
          setPersons(persons.concat(returnedResource))
          setNewName('')
          setNewNumber('')

          // set notification
          setNotification(`Added ${newName}`)
          
          //  set timeout
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        
        .catch(error =>{
          console.log('failed to create', error)
          setNotification(`Failed to add ${newName}`)
          setTimeout(() => {
            setNotification(null)
          }, 500)
        })
      }
  }

  const deletePerson = (id) =>{
    const person = persons.find(p => p.id ===id)
    if (window.confirm(`Delete ${person.name} ?`)) {
      phoneService
        .remove(id)
        .then(response => {
          setPersons(persons.filter(p => p.id !==id))
        })
        .catch(error => {
          // handle error
          console.log('failed to delete', error)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) =>{
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

// filter person
  const filteredPersons = persons.filter(person => person.name &&
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notification}/>

      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange}/>

      <h2>add a new</h2>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      
      <h3>Numbers</h3>

      <Persons persons={filteredPersons} onDelete={deletePerson}/>
    </div>
    )
}
export default App