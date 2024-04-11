async function fetchFutureForecast(city) {
    const API_KEY = 'b8779a0a0fffb0229bb4a07b1171bddc'; // Define your API key here
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Log the response data to inspect its structure
        console.log('Response data:', data);
        
        // Check if 'coord' exists in the response data
        if (!data.coord) {
            console.error('Coordinates not found in response data');
            return;
        }
        
        const { lat, lon } = data.coord;
        const futureForecastUrl = `https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}`;
        const futureForecastResponse = await fetch(futureForecastUrl);
        const futureForecastData = await futureForecastResponse.json();
        displayFutureForecast(futureForecastData, city);
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.d-flex');
    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission
        
        const cityInput = document.getElementById('city');
        const cityName = cityInput.value.trim(); // Get the value of the city input field
        
        if (cityName) {
            await fetchFutureForecast(cityName); // Fetch the future forecast for the entered city
        } else {
            console.error('Please enter a city name');
        }
    });
});

