var currentIndex;

async function getWeatherData(locationName, latitude, longitude) {
    try {
        let location;
        if (latitude && longitude) {
            location = { latitude, longitude };
        } else {
            location = await fetchLocation(locationName);
        }
        if (!location) {
            console.error('Error: Location not found');
            return null;
        }

        const weatherData = await fetchWeather(location.latitude, location.longitude);
        return processWeatherData(weatherData);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

async function fetchLocation(locationName) {
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${locationName.replace(/ /g, '+')}&count=10&language=en&format=json`);
        if (!response.ok) throw new Error('Failed to fetch location data');
        const locationData = await response.json();
        return locationData.results[0];

    } catch (error) {
        console.error('Error fetching location data:', error);
        return null;
    }
}

async function fetchWeather(latitude, longitude) {
    try {
        var url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,visibility,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset`;
        console.log('URL: ' + url);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch weather data');
        return await response.json();

    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

function processWeatherData(weatherData) {
    console.log(weatherData);
    const hourly = weatherData.hourly;
    const time = hourly.time;
    const temperatureDataForHours = hourly.temperature_2m;
    const weatherCode = hourly.weather_code
    const visibility = hourly.visibility;
    const windspeed = hourly.wind_speed_10m;
    const precipitation_probability = hourly.precipitation_probability;
    const relative_humidity_2m = hourly.relative_humidity_2m;
    const daily = weatherData.daily; // Access daily data

    if (!daily || !daily.temperature_2m_max || daily.temperature_2m_max.length === 0) {
        console.error('Error: Daily max temperature data not available');
        return null;
    }

    const temperature_2m_max = daily.temperature_2m_max[0]; // Get the first day's max temperature
    const temperature_2m_min = daily.temperature_2m_min[0]; // Get the first day's min temperature

    const sunriseTime = daily.sunrise[0];
    const sunsetTime = daily.sunset[0];

    const weatherDataHours = {};

    for (let i = 0; i < temperatureDataForHours.length; i++) {
        weatherDataHours[`temperature_hour_${i}`] = temperatureDataForHours[i];
        weatherDataHours[`visibility_hour_${i}`] = visibility[i];
        weatherDataHours[`windspeed_10m_${i}`] = windspeed[i];
        weatherDataHours[`precipitation_probability_${i}`] = precipitation_probability[i];
        weatherDataHours[`relative_humidity_2m_${i}`] = relative_humidity_2m[i];
        weatherDataHours[`temperature_2m_max_${i}`] = temperature_2m_max;
        weatherDataHours[`temperature_2m_min_${i}`] = temperature_2m_min;
        weatherDataHours[`weather_code_${i}`] = weatherCode[i];
    }
    var index = -1;
    console.log("Time: " + getCurrentDatetime());
    console.log(time[2]);
    for (let i = 0; i < time.length; i++) {
        if (getCurrentDatetime() === time[i]) {
            index = i;
            break;
        }
    }
    currentIndex = index;
    console.log("Current Index: " + index);

    // Prepare forecast data
    const forecastData = daily.temperature_2m_max.map((maxTemp, i) => {
        return {
            day: getDayFromDate(daily.sunrise[i]), // Assuming you have a function to get the day from date
         // weatherIcon: getWeatherIconCode(), // Assuming you have a function to get the weather icon code
            minTemperature: daily.temperature_2m_min[i],
            maxTemperature: maxTemp
        };
    });

    return { weatherDataHours, sunriseTime, sunsetTime, forecastData };
}

function convertWeatherCode(weatherCode) {
    var weatherCondition = "";
        if(weatherCode == 0) {
            weatherCondition = "Clear";
        } else if (weatherCode > 0 && weatherCode <= 3) {
            weatherCondition = "Cloudy";
        } else if (weatherCode >= 4 && weatherCode <= 9) {
            weatherCondition = "Haze";
        } else if (weatherCode >= 10 && weatherCode <= 19 ) {
            weatherCondition = "Mist";
        } else if (weatherCode >= 20 && weatherCode <= 29) {
            weatherCondition = "Rain";
        } else if (weatherCode >= 30 && weatherCode <= 39) {
            weatherCondition = "Storm";
        } else if (weatherCode >= 40 && weatherCode <= 49) {
            weatherCondition = "Fog";
        } else if ((weatherCode >= 50 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 99)) {
            weatherCondition = "Rain";
        } else if (weatherCode >= 71 && weatherCode <= 77) {
            weatherCondition = "Snow";
        } else {
            weatherCondition = "Error";
        }

        return weatherCondition;
}

function updateWeatherData(weatherData) {
    const currentTemperature = weatherData.weatherDataHours[`temperature_hour_${currentIndex}`];
    const visibility = weatherData.weatherDataHours[`visibility_hour_${currentIndex}`];
    const windSpeed = weatherData.weatherDataHours[`windspeed_10m_${currentIndex}`];
    const precipitationProbability = weatherData.weatherDataHours[`precipitation_probability_${currentIndex}`];
    const relativeHumidity = weatherData.weatherDataHours[`relative_humidity_2m_${currentIndex}`];
    const maxTemperature = weatherData.weatherDataHours[`temperature_2m_max_${currentIndex}`];
    const minTemperature = weatherData.weatherDataHours[`temperature_2m_min_${currentIndex}`];
    const sunriseTime = weatherData.sunriseTime;
    const sunsetTime = weatherData.sunsetTime;
    const weatherCode = weatherData.weatherDataHours[`weather_code_${currentIndex}`];
    const weatherCodeday2 = weatherData.weatherDataHours[`weather_code_${currentIndex + 24}`];
    const weatherCodeday3 = weatherData.weatherDataHours[`weather_code_${currentIndex + 48}`];
    const weatherCodeday4 = weatherData.weatherDataHours[`weather_code_${currentIndex + 72}`];
    const weatherCodeday5 = weatherData.weatherDataHours[`weather_code_${currentIndex + 96}`];
    const weatherCodeday6 = weatherData.weatherDataHours[`weather_code_${currentIndex + 120}`];
    const weatherCodeday7 = weatherData.weatherDataHours[`weather_code_${currentIndex + 144}`];



    console.log("Weather Code: " +convertWeatherCode(weatherCode))
    document.getElementById('weatherConditionImageDay2').src = `http://127.0.0.1:5500/weather/assets/\/${convertWeatherCode(weatherCode)}.png`
    document.getElementById('weatherConditionImageDay3').src = `http://127.0.0.1:5500/weather/assets/\/${convertWeatherCode(weatherCodeday2)}.png`
    document.getElementById('weatherConditionImageDay4').src = `http://127.0.0.1:5500/weather/assets/\/${convertWeatherCode(weatherCodeday3)}.png`
    document.getElementById('weatherConditionImageDay5').src = `http://127.0.0.1:5500/weather/assets/\/${convertWeatherCode(weatherCodeday4)}.png`
    document.getElementById('weatherConditionImageDay6').src = `http://127.0.0.1:5500/weather/assets/\/${convertWeatherCode(weatherCodeday5)}.png`
    document.getElementById('weatherConditionImageDay7').src = `http://127.0.0.1:5500/weather/assets/\/${convertWeatherCode(weatherCodeday6)}.png`



    document.getElementById('temp').innerText = currentTemperature;
    document.getElementById('visibility').innerText = visibility;
    document.getElementById('temp2').innerText = currentTemperature;
    document.getElementById('windspeed').innerText = windSpeed;
    document.getElementById('windspeed2').innerText = windSpeed;
    document.getElementById('precipitation_probability').innerText = precipitationProbability ? precipitationProbability.toString() : 'N/A';
    document.getElementById('relative_humidity').innerText = relativeHumidity ? relativeHumidity.toString() : '0';
    document.getElementById('max_temp').innerText = maxTemperature ? maxTemperature.toString() : 'N/A';
    document.getElementById('min_temp').innerText = minTemperature ? minTemperature.toString() : 'N/A';
    document.getElementById('relativehumidity2').innerText = relativeHumidity ? relativeHumidity.toString() : 'N/A';
    document.getElementById('precipitation_probability').innerText = precipitationProbability != null ? precipitationProbability.toString() : 'N/A';
    document.getElementById('sunrise_time').innerText = sunriseTime ? sunriseTime.toString() : '0';
    document.getElementById('sunset_time').innerText = sunsetTime ? sunsetTime.toString() : '0';

}

function getCurrentDatetime() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}T${hours}:00`;
    return formattedDate;
}

var searchForm = document.querySelector('.d-flex');
var cityNameElement = document.getElementById('cityname');

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const locationName = document.getElementById('city').value.trim();
        if (locationName === '') {
            alert('Please enter a location.');
            return;
        }
        cityNameElement.innerText = locationName; // Update the city name in the heading
        const weatherData = await getWeatherData(locationName);
        if (weatherData) {
            getCurrentDatetime();
            updateWeatherData(weatherData);
            // Call updateForecast function with the forecast data
            updateForecast(weatherData.forecastData);
        } else {
            alert('Failed to fetch weather data for the specified location.');
        }

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching weather data.');
    }
});
function showLocation(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    alert("Latitude : " + latitude + " Longitude: " + longitude);
 }

 function errorHandler(err) {
    if(err.code == 1) {
       alert("Error: Access is denied!");
    } else if( err.code == 2) {
       alert("Error: Position is unavailable!");
    }
 }
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(logPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
  
  function logPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log("Current Position:", latitude, longitude);
  }


// Function to fetch weather data for the user's current location using geolocation
async function fetchCurrentLocationWeather() {
    console.log('Fetching current location weather');
    console.log('Fetching weather data');
    try {
        // Get user's current position
        const position = await getCurrentPosition();
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const locationData = await reverseGeocode(latitude, longitude);
        const cityName = locationData.city;
        const weatherData = await getWeatherData(cityName, latitude, longitude);
        if (weatherData) {
            updateWeatherData(weatherData);
    //        updateForecast(weatherData.forecastData);
            //Update UI to show current location
            document.getElementById('cityname').innerText = cityName;
        } else {
            alert('Failed to fetch weather data for the current location.');
        }
    } catch (error) {
        console.error('Error fetching current location weather:', error);
        alert('An error occurred while fetching current location weather data.');
    }
}

// Function to get user's current position
function getCurrentPosition() {
    console.log('GetCurrentPosition');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

// Function to reverse geocode coordinates to get location details
async function reverseGeocode(latitude, longitude) {
    console.log('ReverseGeocode');
    try {
        const response = await fetch(`https://geocode.xyz/${latitude},${longitude}?json=1`);
        if (!response.ok) {
            throw new Error('Failed to reverse geocode coordinates');
        }
        return await response.json();
    } catch (error) {
        console.error('Error reverse geocoding:', error);
        throw error;
    }
}

// Call fetchCurrentLocationWeather when the page loads
window.addEventListener('load', fetchCurrentLocationWeather);

// Function to update the forecast
function updateWeatherCast(forecastData) {
    const forecastContainer = document.getElementById('weather-forecast');
    forecastContainer.innerHTML = ''; // Clear previous forecast

    forecastData.forEach(dayData => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('weather-forecast-item');

        const dayNameDiv = document.createElement('div');
        dayNameDiv.classList.add('day');
        dayNameDiv.innerText = getDayFromDate(dayData.date); // Assuming date field in dayData
        dayDiv.appendChild(dayNameDiv);

        const weatherIconImg = document.createElement('img');
        weatherIconImg.alt = 'Weather Condition Image';
        weatherIconImg.classList.add('w-icon');
         weatherIconImg.src = getWeatherIconUrl(dayData.weatherCode); // Assuming weatherCode field in dayData
        dayDiv.appendChild(weatherIconImg);

        const maxTempDiv = document.createElement('div');
        maxTempDiv.classList.add('temp');
        maxTempDiv.innerText = `Night - ${dayData.minTemperature}°C`;
        dayDiv.appendChild(maxTempDiv);

        const minTempDiv = document.createElement('div');
        minTempDiv.classList.add('temp');
        minTempDiv.innerText = `Day - ${dayData.maxTemperature}°C`;
        dayDiv.appendChild(minTempDiv);

        forecastContainer.appendChild(dayDiv);
    });
}

// Function to get weather icon URL based on the condition
function getWeatherIconUrl(weatherCode) {
    let weatherCondition = getWeatherIconCode(weatherCode);
    let iconUrl = "assets/default.png"; // Default image URL

    switch (weatherCondition) {
        case "Clear":
            iconUrl = "assets/clear.png";
            break;
        case "Cloudy":
            iconUrl = "assets/cloudy.png";
            break;
        case "Rain":
            iconUrl = "assets/rain.png";
            break;
        case "Snow":
            iconUrl = "assets/snow.png";
            break;
        default:
            // Default image or error handling
            break;
    }

    return iconUrl;
}

// Function to get day from date
function getDayFromDate(dateString) {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
}

