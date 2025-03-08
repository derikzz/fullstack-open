const Person = ({p, deletePerson}) => {
    return (
        <div>
            {p.name} {p.number}
            <button onClick={deletePerson}>delete</button>
        </div>
    )
}

const Persons = ({personsToShow, deletePerson}) => {
    return (
        <div>
            {personsToShow.map(person => 
                <Person 
                    key={person.id} 
                    p={person} 
                    deletePerson={() => deletePerson(person.id)}/>
            )}
        </div>
    )
}

export default Persons

