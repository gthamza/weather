async function fetchWeatherByGeoposition(latitude, longitude, displayFunction) {
    const url = `https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?lat=${latitude}&lon=${longitude}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '72a5d188dcmsh3cfa9347e935675p16584cjsne16cfdc22c1a',
            'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        displayFunction(data);
    } catch (error) {
        console.error(error);
    }
}

async function fetchData() {
    const submit = document.getElementById('submit');
    const cityInput = document.getElementById('city');

    async function fetchWeather(city) {
        const url = `https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=${city}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '72a5d188dcmsh3cfa9347e935675p16584cjsne16cfdc22c1a',
                'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            displayWeatherData(data, city);
        } catch (error) {
            console.error(error);
        }
    }

    function displayWeatherData(data, city) {
        const capitalizeFirstLetter = (string) => {
            return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
        };

        document.getElementById('cityname').textContent = capitalizeFirstLetter(city);
        document.getElementById('cloud_pct').textContent = data.cloud_pct;
        document.getElementById('temp').textContent = data.temp;
        document.getElementById('temp2').textContent = data.temp;
        document.getElementById('feels_like').textContent = data.feels_like;
        document.getElementById('humidity').textContent = data.humidity;
        document.getElementById('humidity2').textContent = data.humidity;
        document.getElementById('min_temp').textContent = data.min_temp;
        document.getElementById('max_temp').textContent = data.max_temp;
        document.getElementById('wind_speed').textContent = data.wind_speed;
        document.getElementById('wind_speed2').textContent = data.wind_speed;
        document.getElementById('wind_degrees').textContent = data.wind_degrees;
        document.getElementById('sunrise').textContent = data.sunrise;
        document.getElementById('sunset').textContent = data.sunset;
    }

    submit.addEventListener("click", async (e) => {
        e.preventDefault();
        const cityValue = cityInput.value;
        await fetchWeather(cityValue);
    });

    async function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                await fetchWeatherByGeoposition(latitude, longitude, displayWeatherData);
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    getLocation(); 

    const otherCities = [
        { name: 'Delhi', id: 'delhi-data' },
        { name: 'London', id: 'london-data' },
        { name: 'Boston', id: 'boston-data' },
        { name: 'Shanghai', id: 'shanghai-data' },
    ];

    for (const city of otherCities) {
        const dataElement = document.getElementById(city.id);
        const cityNameElement = document.createElement('td');
        cityNameElement.textContent = city.name;
        dataElement.appendChild(cityNameElement);

        const url = `https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=${city.name}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '72a5d188dcmsh3cfa9347e935675p16584cjsne16cfdc22c1a',
                'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const otherCityData = await response.json();

            const cityRow = `
                <td>${otherCityData.cloud_pct}</td>
                <td>${otherCityData.temp}</td>
                <td>${otherCityData.feels_like}</td>
                <td>${otherCityData.humidity}</td>
                <td>${otherCityData.min_temp}</td>
                <td>${otherCityData.max_temp}</td>
                <td>${otherCityData.wind_speed}</td>
                <td>${otherCityData.wind_degrees}</td>
                <td>${otherCityData.sunrise}</td>
            `;

            dataElement.innerHTML += cityRow;
        } catch (error) {
            console.error(`Error fetching data for ${city.name}:`, error);
        }
    }
}

fetchData();
