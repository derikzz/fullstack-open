

const DisplayCountry = ({ country, weather }) => {
    if (country == null || weather == null) {
        return null
    }

    return (
        <div>
            <h1>{country.name.common}</h1>
            <div>
                Capital: {country.capital[0]} <br />
                Area: {country.area}
            </div>
            <h2>Languages</h2>
            <ul>
                {Object.values(country.languages).map((language, index) =>
                    <li key={index}>
                        {language}
                    </li>
                )}
            </ul>
            <img 
                src={country.flags.png}
            />
            <h2>Weather in {country.capital[0]}</h2>
            <div>Temperature: {(weather.main.temp - 273.15).toFixed(2)} Celsius</div>
            <img 
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            />
            <div>Wind: {(weather.wind.speed.toFixed(2))} m/s</div>
        </div>
    )
}

export default DisplayCountry