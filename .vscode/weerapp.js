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
      if (data.cod === 200) {
        displayWeather(data);
      } else {
        document.getElementById('weatherInfo').innerHTML = 'City not found';
      }
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
}

function displayWeather(data) {
  const weatherInfo = `
    <h2>The Weather in: ${data.name}</h2>
    <p>Temperature: ${data.main.temp} °C</p>
    <p>Weather: ${data.weather[0].description}</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;

  document.getElementById('weather-result').innerHTML = weatherInfo;

  document.body.classList.remove("high", "warm", "allright", "cold", "freezing");
  
  const temp = data.main.temp;

  if (temp > 25) {
    document.body.classList.add("high");
  } else if (temp > 20 && temp <= 25) {
    document.body.classList.add("warm"); 
  } else if (temp > 10 && temp <= 20) {
    document.body.classList.add("allright"); 
  } else if (temp > 0 && temp <= 10) {
    document.body.classList.add("cold"); 
} else {
  document.body.classList.add("freezing")}; 
};

document.getElementById('get-weather').addEventListener('click', getWeather);
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
      getWeather();
  }
});