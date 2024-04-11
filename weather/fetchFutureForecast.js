async function fetchFutureForecast(city) {
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
        const futureForecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&units=metric&appid=${API_KEY}`;
        const futureForecastResponse = await fetch(futureForecastUrl);
        const futureForecastData = await futureForecastResponse.json();
        displayFutureForecast(futureForecastData, city);
    } catch (error) {
        console.error(error);
    }
}
