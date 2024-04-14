document.addEventListener('DOMContentLoaded', function() {
    const timeEl = document.getElementById('time');
    const dateEl = document.getElementById('date');
    const currentWeatherItemsEl = document.getElementById('current-weather-items');
    const weatherForecastEl = document.getElementById('weather-forecast');
    const currentTempEl = document.getElementById('current-temp');

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const API_KEY = '49cc8c821cd2aff9af04c9f98c36eb74';

    setInterval(() => {
        const time = new Date();
        const month = time.getMonth();
        const date = time.getDate();
        const day = time.getDay();
        const hour = time.getHours();
        const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
        const minutes = time.getMinutes();
        const ampm = hour >= 12 ? 'PM' : 'AM';
        // Assuming you have defined the variables hoursIn12HrFormat, minutes, and ampm

const timeEl = document.getElementById('current-time');

timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`;

        dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];

    }, 1000);

    getWeatherData();

    function getWeatherData() {
        navigator.geolocation.getCurrentPosition((success) => {
            let { latitude, longitude } = success.coords;

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    showWeatherData(data);
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                });
        });
    }

        function showWeatherData(data) {
                
            let otherDayForecast = '';
            data.daily.forEach((day, idx) => {
                if (idx == 0) {
                    currentTempEl.innerHTML = `
                        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" 
                             alt="weather icon" class="w-icon">
                        <div class="other">
                            <div class="day">${window.moment(day.dt * 1000).format('dddd')}</div>
                            <div class="temp">Night - ${day.temp.night}&#176;C</div>
                            <div class="temp">Day - ${day.temp.day}&#176;C</div>
                        </div>`;
                } else {
                    otherDayForecast += `
                        <div class="weather-forecast-item">
                            <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" 
                                 alt="weather icon" class="w-icon">
                            <div class="temp">Night - ${day.temp.night}&#176;C</div>
                            <div class="temp">Day - ${day.temp.day}&#176;C</div>
                        </div>`;
                }
            });
        
            weatherForecastEl.innerHTML = otherDayForecast;
        }
        
    }
);
