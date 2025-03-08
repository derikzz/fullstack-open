const ListCountry = ({ country, setDisplayCountry }) => {
    return (
        <div>
            {country.name.common}
            <button onClick={() => setDisplayCountry(country)}>Show</button>
        </div>
    )
}

export default ListCountry