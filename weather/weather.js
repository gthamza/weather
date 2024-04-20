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
            weatherIcon: getWeatherIconCode(), // Assuming you have a function to get the weather icon code
            minTemperature: daily.temperature_2m_min[i],
            maxTemperature: maxTemp
        };
    });

    return { weatherDataHours, sunriseTime, sunsetTime, forecastData };
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

// Add geolocation support
function getLocation() {
    if (navigator.geolocation) {
        console.log("Getting user's location...");
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    try {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log('Latitude: ' + latitude + ' Longitude: ' + longitude);
        getWeatherData(null, latitude, longitude);
    } catch (error) {
        console.error('Error getting geolocation:', error);
    }
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
    }
}

// Call getLocation() to get weather data for the user's current location
getLocation();

function getDayFromDate(dateString) {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
}

function updateCurrentWeather(currentWeather) {
    document.getElementById('current-weather-icon').src = `http://openweathermap.org/img/wn/${currentWeather.weatherIcon}@2x.png`;
    document.getElementById('current-day').innerText = currentWeather.day;
    document.getElementById('current-night-temp').innerText += `${currentWeather.minTemperature}°C`;
    document.getElementById('current-day-temp').innerText += `${currentWeather.maxTemperature}°C`;
}

// Function to update the forecast
function updateForecast(forecastData) {
    const forecastContainer = document.getElementById('weather-forecast');
    forecastContainer.innerHTML = ''; // Clear previous forecast

    forecastData.forEach(dayData => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('weather-forecast-item');

        const dayNameDiv = document.createElement('div');
        dayNameDiv.classList.add('day');
        dayNameDiv.innerText = dayData.day;
        dayDiv.appendChild(dayNameDiv);

        const weatherIconImg = document.createElement('img');
        const iconCode = getWeatherIconCode(dayData.weatherIcon); // Get weather icon code
        weatherIconImg.src = `http://openweathermap.org/img/wn/${iconCode}.png`; // Construct icon URL
        weatherIconImg.alt = 'weather icon';
        weatherIconImg.classList.add('w-icon');
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

function getWeatherIconCode(weatherCode) {
    // Define your mapping of weather codes to icon codes here
    // For example:
    const codeMap = {
        '01d': '01d', // clear sky (day)
        '01n': '01n', // clear sky (night)
        '02d': '02d', // few clouds (day)
        '02n': '02n', // few clouds (night)
        // Add more mappings as needed
    };
    
    // Check if the weather code exists in the map
    if (codeMap.hasOwnProperty(weatherCode)) {
        return `${codeMap[weatherCode]}?${Date.now()}`; // Add cache-busting parameter
    } else {
        // Return a default icon code if the weather code is not found
        return 'default';
    }
}
function getWeatherIconCode(weatherCode) {
    const codeMap = {
        '01d': '01d',
        '01n': '01n',
        '02d': '02d',
        '02n': '02n',
        // Add more mappings as needed
    };

    if (codeMap.hasOwnProperty(weatherCode)) {
        return `${codeMap[weatherCode]}@2x.png?${Date.now()}`; // Add cache-busting parameter
    } else {
        return 'default';
    }
}

function updateForecast(forecastData) {
    const forecastContainer = document.getElementById('weather-forecast');
    forecastContainer.innerHTML = ''; // Clear previous forecast

    forecastData.forEach(dayData => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('weather-forecast-item');

        const dayNameDiv = document.createElement('div');
        dayNameDiv.classList.add('day');
        dayNameDiv.innerText = dayData.day;
        dayDiv.appendChild(dayNameDiv);

        const weatherIconImg = document.createElement('img');
        const iconCode = dayData.weatherIcon; // Get weather icon code
        weatherIconImg.src = `http://openweathermap.org/img/wn/${iconCode}.png`; // Construct icon URL
        weatherIconImg.alt = 'weather icon';
        weatherIconImg.classList.add('w-icon');
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
