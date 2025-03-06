const Person = ({p}) => {
    return (
        <div>
            {p.name} {p.number}
        </div>
    )
}

const Persons = ({personsToShow}) => {
    return (
        <div>
            {personsToShow.map(person => 
                <Person key={person.id} p={person}/>
            )}
        </div>
    )
}

export default Persons

