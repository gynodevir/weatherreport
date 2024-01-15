const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-btn');
const dcity = document.getElementById('dcity');
const weatherCardsDiv = document.querySelector('#weather-cards');
const currentWeather = document.querySelector('.current-weather');
const API_KEY = "027aad48636d5b2a4c967d2d547304f7";
const locationButton = document.querySelector(".location-btn");

function setClearSkyBackground() {
    console.log("Clear sky condition detected");
    document.body.style.background = "url('https://i.pinimg.com/736x/6d/87/73/6d8773acde0977033029d421ae550733.jpg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
}
function brokenCloud() {
    console.log(" broken cloud condition detected");
    document.body.style.background = "url('https://live.staticflickr.com/1828/28636482297_bd428f26e8_b.jpg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
}
function Rainy() {
    console.log(" broken cloud condition detected");
    document.body.style.background = "url('https://s7d2.scene7.com/is/image/TWCNews/heavy_rain_jpg-6')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
}
function Snow(){
    console.log(" broken cloud condition detected");
    document.body.style.background = "url('https://t4.ftcdn.net/jpg/01/30/24/67/360_F_130246761_XVWbg4AGgGu7SlcKi2QPR23J03U710mP.jpg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
}
const currentWeatherCard = (cityName, weatherItem, index) => {
    if (weatherItem.weather[0].description === "clear sky") {
        setClearSkyBackground();
    }
    else if(weatherItem.weather[0].description=="rainy"){
         Rainy();
    }
    else if(weatherItem.weather[0].description=="snow"){
        Snow()
    }
    else
    {
        brokenCloud();
    }
    console.log(weatherItem.weather[0].description)
    return `<div class="details" id="details">
    <h2 id="dcity">${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
    <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
</div>
<div class="icon">
    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
    <h6>${weatherItem.weather[0].description}</h6>
</div>`;
};

const createWeatherCard = (cityName, weatherItem, index) => {
    if (index !== 0) {
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
    }
};

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then(res => res.json())
        .then(data => {
            const uniqueForecastDays = [];
            const fiveDaysForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    return uniqueForecastDays.push(forecastDate);
                }
            });

            console.log(fiveDaysForecast);
            console.log(`temp ${fiveDaysForecast[0].main.temp} and weather : ${fiveDaysForecast[0].weather[0].description}`);

            // Clear previous weather cards
            weatherCardsDiv.innerHTML = '';
            currentWeather.innerHTML = '';

            fiveDaysForecast.forEach((weatherItem, index) => {
                if (index === 0) {
                    const html2 = currentWeatherCard(cityName, weatherItem, index);
                    currentWeather.insertAdjacentHTML("beforeend", html2);
                } else {
                    const html = createWeatherCard(cityName, weatherItem, index);
                    weatherCardsDiv.insertAdjacentHTML("beforeend", html);
                }
            });
        })
        .catch(() => {
            alert("An error occurred while fetching the Weather Forecast");
        });
};

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            if (!data.length) return alert(`An error occurred while fetching the coordinates of ${cityName}`);
            console.log(data[0]);
            const { name, lat, lon } = data[0];
            dcity.innerHTML = name;
            getWeatherDetails(name, lat, lon);
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates");
        });
};
const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords; 
            
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL).then(response => response.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("An error occurred while fetching the city name!");
            });
        },
        error => { 
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        });
}
locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener('click', getCityCoordinates);