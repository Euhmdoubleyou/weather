const apiKey = '37d8bd68ec43f6f9151eb95108e61ee3';

function getWeather() {
  const city = document.getElementById('cityName').value;
  
  if (!city) {
    alert('Please enter a city name');
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod == 200) {
        displayWeather(data);
      } else {
        document.getElementById('weatherApp').innerHTML = 'City not found';
      }
    })
    .catch(error => {
      console.log('Error fetching weather data:');
    });
}

function displayWeather(data) {
  const weatherInfo = `
    <h2>The Weather in: ${data.name}</h2>
    <p>Temperature: ${data.main.temp} °C</p>
    <p>Feels like: ${data.main.feels_like} °C</p>
    <p>Weather: ${data.weather[0].description}</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;

  document.getElementById('weather-result').innerHTML = weatherInfo;

  const icon = data.weather[0].icon;
  const description = data.weather[0].description;

  document.getElementByIdElement("imgContainer").innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}.png" alt="${description}">`;

  document.body.classList.remove("high", "warm", "allright", "cold", "freezing");
  
  const temp = data.main.temp;

  if (temp > 25) {
    document.body.classList.add("high");
  } else if (temp > 18 && temp <= 25) {
    document.body.classList.add("warm"); 
  } else if (temp > 10 && temp <= 18) {
    document.body.classList.add("allright"); 
  } else if (temp > 0 && temp <= 10) {
    document.body.classList.add("cold"); 
} else {
  document.body.classList.add("freezing")}; 
}

function getForecast() {
  const cityFc = document.getElementById('cityName').value;
  const urlFc = `https://api.openweathermap.org/data/2.5/forecast?q=${cityFc}&appid=${apiKey}&units=metric`;

  fetch(urlFc)
    .then(response => response.json())
    .then(data => {
      if (data.cod == 200) {
        displayForecast(data);
      } else {
        document.getElementById('upcoming').innerHTML = 'Forecast not available';
      }
    })
    .catch(error => {
      document.getElementById('upcoming').innerHTML = 'Forecast Error';
    });
}
  
function displayForecast(data) {
  const upcomingElement = document.getElementById("upcoming");
  upcomingElement.innerHTML = ''; // Clear previous content

  // Group forecast data by date
  const groupedByDate = data.list.reduce((acc, item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  // Create forecast display for each date
  for (const [date, items] of Object.entries(groupedByDate)) {
    const dateContainer = document.createElement('div');
    dateContainer.className = 'date-container';
    dateContainer.innerHTML = `<h2>${formatDate(date)}</h2>`;

    items.forEach(item => {
      const timeContainer = document.createElement('div');
      timeContainer.className = 'time-container';
      
      const time = item.dt_txt.split(' ')[1].slice(0, 5); // Extract HH:MM
      const temp = Math.round(item.main.temp);
      const windSpeed = item.wind.speed.toFixed(1);
      const windDirection = getWindDirection(item.wind.deg);
      const icon = item.weather[0].icon;
      const description = item.weather[0].description;
      
      if (time == "15:00") {
      timeContainer.innerHTML = `
        <p>${temp}°C</p>
        <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${description}">
      `;
      } else {
        timeContainer.innerHTML = "";
      }

      dateContainer.appendChild(timeContainer);
    });

    upcomingElement.appendChild(dateContainer);
  }
}

function formatDate(dateString) {
  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function getWindDirection(degrees) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(degrees / 45) % 8];
}


document.getElementById('get-weather').addEventListener('click', getWeather);
document.getElementById('get-weather').addEventListener('click', getForecast);
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
      getWeather();
      getForecast();
  }
});



