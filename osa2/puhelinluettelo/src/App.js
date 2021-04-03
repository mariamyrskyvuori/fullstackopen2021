import React, {useEffect, useState} from 'react'
import personsService from './services/persons'

const Filter = ({onChange, filterName}) => {
    return (
        <div>filter shown with: <input
            value={filterName}
            onChange={onChange}
        />
        </div>
    )
}
const PersonForm = ({onSubmit, onNameChange, newName, onNumberChange, newNumber}) => {
    return (
        <form onSubmit={onSubmit}>
            <div>
                name: <input
                value={newName}
                onChange={onNameChange}
            />
            </div>
            <div>
                number: <input
                value={newNumber}
                onChange={onNumberChange}
            />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}
const Persons = ({personsToShow, removePerson}) => {
    return (
        <div>{personsToShow.map(person => <p key={person.name}>{person.name} {person.number}
            <button onClick={() => removePerson(person)}>delete</button>
        </p>)}
        </div>
    )
}

const ErrorNotification = ({message}) => {
    if (!message) {
        return null
    }

    const errorStyle = {
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    return (
        <div style={errorStyle}>
            {message}
        </div>
    )
}
const AddedNotification = ({message}) => {
    if (!message) {
        return null
    }

    const addedStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    return (
        <div style={addedStyle}>
            {message}
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])
    console.log('render', persons.length, 'persons')
    useEffect(() => {
        personsService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
            })
    }, [])

    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [showAll, setShowAll] = useState(true)
    const [filterName, setFilterName] = useState('')
    const [errorMessage, setErrorMessage] = useState()
    const [addedMessage, setAddedMessage] = useState()

    const addName = (event) => {
        event.preventDefault()
        const personObject = {
            name: newName,
            number: newNumber
        }
        const personToUpdate = persons.find((({name}) => name === newName))
        if (!!personToUpdate) {
            if (window.confirm(newName + " is already added to phonebook, replace the old number with a new one?")) {
                personsService
                    .update(personToUpdate.id, personObject)
                    .then(returnedPerson => {
                        setPersons(persons.map(person => {
                            return person.name !== newName ? person : returnedPerson
                        }))
                        setNewName('')
                        setNewNumber('')
                        setAddedMessage(
                            `Updated '${returnedPerson.name}'`
                        )
                        setTimeout(() => {
                            setAddedMessage(null)
                        }, 3000)
                    })
                    .catch(error => {
                        setErrorMessage(
                            `Information of '${personToUpdate.name}' has already been removed from server`
                        )
                        setTimeout(() => {
                            setErrorMessage(null)
                        }, 3000)
                    })

            }
        } else {
            personsService
                .create(personObject)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                    setNewName('')
                    setNewNumber('')
                    setAddedMessage(
                        `Added '${returnedPerson.name}'`
                    )
                    setTimeout(() => {
                        setAddedMessage(null)
                    }, 3000)
                })
        }
    }
    const removePerson = (person) => {
        if (window.confirm("Delete " + person.name + "?")) {
            personsService
                .removePerson(person.id)
                .then(() => {
                    personsService
                        .getAll()
                        .then(persons => {
                            setPersons(persons)
                        })
                    setAddedMessage(
                        `Deleted '${person.name}'`
                    )
                    setTimeout(() => {
                        setAddedMessage(null)
                    }, 3000)
                })

        }
    }
    const personsToShow = showAll
        ? persons
        : persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))
    const handleNameChange = (event) => {
        console.log(event.target.value)
        setNewName(event.target.value)
    }
    const handleNumberChange = (event) => {
        console.log(event.target.value)
        setNewNumber(event.target.value)
    }
    const handleFilterChange = (event) => {
        console.log(event.target.value)
        setShowAll(event.target.value === "")
        setFilterName(event.target.value)
    }
    return (
        <div>

            <h1>Phonebook</h1>
            <ErrorNotification message={errorMessage}/>
            <AddedNotification message={addedMessage}/>
            <div>
                <Filter filterName={filterName} onChange={handleFilterChange}/>
                <h2>Add a new</h2>
                <PersonForm onSubmit={addName}
                            newName={newName} onNameChange={handleNameChange}
                            newNumber={newNumber} onNumberChange={handleNumberChange}/>
                <h2>Numbers</h2>
                <Persons personsToShow={personsToShow} removePerson={removePerson}/>
            </div>
        </div>
    )

}

export default App
