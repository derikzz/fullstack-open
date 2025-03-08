import axios from 'axios'
const baseUrl = (lat, lon, key) =>
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;

const getWeather = (country, key) => {
    const request = axios.get(baseUrl(country.capitalInfo.latlng[0], country.capitalInfo.latlng[1], key))
    return request.then(response => response.data)
}

export default { getWeather }