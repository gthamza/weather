async function fetchData() {
    const submit = document.getElementById('submit'); // Get the submit button
    const cityInput = document.getElementById('city'); // Get the city input field

    const fetchWeather = async (city) => {
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
            document.getElementById('cityname').innerHTML = capitalizeFirstLetter(city);            
            document.getElementById('cloud_pct').innerHTML = data.cloud_pct;
            document.getElementById('temp').innerHTML = data.temp;
            document.getElementById('temp2').innerHTML = data.temp;
            document.getElementById('feels_like').innerHTML = data.feels_like;
            document.getElementById('humidity').innerHTML = data.humidity;
            document.getElementById('humidity2').innerHTML = data.humidity;
            document.getElementById('min_temp').innerHTML = data.min_temp;
            document.getElementById('max_temp').innerHTML = data.max_temp;
            document.getElementById('wind_speed').innerHTML = data.wind_speed;
            document.getElementById('wind_speed2').innerHTML = data.wind_speed;
            document.getElementById('wind_degrees').innerHTML = data.wind_degrees;
            document.getElementById('sunrise').innerHTML = data.sunrise;
            document.getElementById('sunset').innerHTML = data.sunset;
            console.log(data); // Logging JSON response data
        } catch (error) {
            console.error(error);
        }
    }

    submit.addEventListener("click", async (e) => { // Add async keyword here
        e.preventDefault();
        const cityValue = cityInput.value;
        await fetchWeather(cityValue); // Wait for the weather data to be fetched
    });

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Fetch and display weather information for other cities
    const otherCities = [
        { name: 'delhi', id: 'delhi-data' },
        { name: 'london', id: 'london-data' },
        { name: 'boston', id: 'boston-data' },
        { name: 'shanghai', id: 'shanghai-data' },
    ];

    for (const city of otherCities) {
        const dataElement = document.getElementById(city.id);
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

            // Create HTML content for the row
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

            // Set the HTML content to the row element
            dataElement.innerHTML = cityRow;
        } catch (error) {
            console.error(`Error fetching data for ${city.name}:`, error);
        }
    }
}

// Call the async function
fetchData();
