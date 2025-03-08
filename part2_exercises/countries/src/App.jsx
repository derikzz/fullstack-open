import { useState } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'
import CountriesMessage from './components/CountriesMessage'
import DisplayCountry from './components/DisplayCountry'
import ListCountry from './components/ListCountry'

function App() {
  const [countriesToSearch, setCountriesToSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [displayCountry, setDisplayCountry] = useState(null)
  const [weather, setWeather] = useState(null)
  const [tooManyMatchesMessage, setTooManyMatchesMessage] = useState(null)

  const api_key = import.meta.env.VITE_SOME_KEY

  const searchCountries = (search) => {
    let filteredCountries = []
    countryService
      .getAll()
      .then(returnedCountries => {
        filteredCountries = returnedCountries.filter(c => c.name.common.toLowerCase().includes(search.toLowerCase()))
        if(filteredCountries.length > 10) {
          setCountries([])
          setDisplayCountry(null)
          setWeather(null)
          setTooManyMatchesMessage('Too many matches, specify another filter')
        } else if(filteredCountries.length > 1) {
          setDisplayCountry(null)
          setWeather(null)
          setTooManyMatchesMessage(null)
          setCountries(filteredCountries)
        } else if(filteredCountries.length == 1) {
          setTooManyMatchesMessage(null)
          setCountries([])
          setDisplayCountry(filteredCountries[0])
          getCountryWeather(filteredCountries[0])
        }
      })
  }

  const getCountryWeather = (country) => {
    weatherService
      .getWeather(country, api_key)
      .then(returnedWeather => {
        setWeather(returnedWeather)
      })
  }

  const handleDisplayCountryChange = (country) => {
    setDisplayCountry(country)
    getCountryWeather(country)
  }

  const handleCountryChange = (event) => {
    setCountriesToSearch(event.target.value)
    searchCountries(event.target.value)
  }

  return (
    <div>
      <div>
        find countries
        <input 
          value={countriesToSearch}
          onChange={handleCountryChange}
        />
      </div>

      <CountriesMessage message={tooManyMatchesMessage} />

      <div>
        {countries.map(country => 
          <ListCountry 
            key={country.name.common} 
            country={country}
            setDisplayCountry={handleDisplayCountryChange}
          />
        )}
      </div>

      <DisplayCountry 
        country={displayCountry}
        weather={weather}
      />

    </div>
  )
}

export default App
