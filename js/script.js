const search = document.querySelector("#search")
const weather = document.querySelector('#weather')
const cityName = document.querySelector("#city_name")
const alert = document.querySelector("#alert")
const title = document.querySelector("#title")
const tempValue = document.querySelector("#temp_value")
const tempDescription = document.querySelector("#temp_description")
const tempImg = document.querySelector("#temp_img")
const tempMax = document.querySelector("#temp_max")
const tempMin = document.querySelector("#temp_min")
const humidity = document.querySelector("#humidity")
const wind = document.querySelector("#wind")

const apikey = ''

search.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (!cityName.value) return showAlert('Adicione o nome da cidade')

    try {
        // BUSCA ESTADO + LAT/LON
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURI(cityName.value)}&limit=1&appid=${apikey}`
        const geoRes = await fetch(geoUrl)
        const geoJson = await geoRes.json()

        if (!geoJson.length) return showAlert('Cidade não encontrada')

        const state = geoJson[0].state || geoJson[0].country
        const lat = geoJson[0].lat
        const lon = geoJson[0].lon

        // BUSCA CLIMA PELO LAT/LON
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric&lang=pt_br`
        const results = await fetch(weatherUrl)
        const json = await results.json()
        console.log(json);
        
        if (json.cod === 200) {
            showInfos({
                city: json.name,
                state: state,
                temp: json.main.temp,
                tempMax: json.main.temp_max,
                tempMin: json.main.temp_min,
                tempIcon: json.weather[0].icon,
                description: json.weather[0].description,
                windSpeed: json.wind.speed,
                humidity: json.main.humidity
            })
        } else {
            showAlert(json.message)
        }

    } catch (error) {
        showAlert('Erro ao buscar dados')
    }
})

const showInfos = (json) => {
    showAlert('')
    weather.classList.add('show')

    title.innerHTML = `${json.city}, ${json.state}`
    tempValue.innerHTML = `${json.temp.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`
    tempDescription.innerHTML = json.description
    tempImg.setAttribute('src', `https://openweathermap.org/img/wn/${json.tempIcon}@2x.png`)
    tempMax.innerHTML = `${json.tempMax.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`
    tempMin.innerHTML = `${json.tempMin.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`
    humidity.innerHTML = `${json.humidity}%`
    wind.innerHTML = `${json.windSpeed.toFixed(1)}km/h`
}

const showAlert = (msg) => {
    alert.innerHTML = msg
}
