document.addEventListener('DOMContentLoaded', function() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    function getWeatherData(cityName) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // Process the weather data here
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    }

    function showWeatherData(data) {
        // Process and display weather data here
    }

    document.getElementById('searchForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const cityName = document.getElementById('city').value;
        getWeatherData(cityName);
    });
});
