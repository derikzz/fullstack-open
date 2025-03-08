const CountriesMessage = ({ message }) => {
    if (message === null) {
        return null
    }

    return (
        <div>
            {message}
        </div>
    )
}

export default CountriesMessage