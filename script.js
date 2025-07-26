const apiKey = "87f338030a4287a9e3d3eft0f98bcfo4";

document.getElementById("search-form").addEventListener("submit", function (event) {
  event.preventDefault();
  let city = document.getElementById("city-input").value;
  getWeatherData(city);
});

// MAIN weather info
function getWeatherData(city) {
  const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      document.getElementById("city-name").innerText = data.city;
      document.getElementById("temperature").innerText = `🌡️ ${data.temperature.current} °C`;
      document.getElementById("description").innerText = `📋 ${data.condition.description}`;
      document.getElementById("wind").innerText = `💨 Wind: ${data.wind.speed} m/s`;

      const weatherInfo = {
        main: data.condition.icon,
        description: data.condition.description
      };

      document.getElementById("icon").src = getCuteIcon(weatherInfo);

      // Load forecast too
      getForecast(city);
    })
    .catch(error => {
      alert("City not found. Please try again.");
      console.error(error);
    });
}

// FORECAST fetch
function getForecast(city) {
  const apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayForecast(data.daily);
    })
    .catch(error => {
      console.error("Forecast error:", error);
    });
}

// Display forecast
function displayForecast(days) {
  const forecastEl = document.getElementById("forecast");
  forecastEl.innerHTML = "";

  for (let i = 1; i <= 5; i++) {
    const day = days[i];
    const date = new Date(day.time * 1000);
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });

    const weatherInfo = {
      main: day.condition.icon,
      description: day.condition.description
    };

    const icon = getCuteIcon(weatherInfo);

    forecastEl.innerHTML += `
      <div class="forecast-day">
        <div class="forecast-date">${weekday}</div>
        <img src="${icon}" alt="${day.condition.description}" />
        <div class="forecast-temp">${Math.round(day.temperature.maximum)}°C</div>
      </div>
    `;
  }
}

// Cute icon mapper
function getCuteIcon(weather) {
  const main = weather.main.toLowerCase();
  const desc = weather.description.toLowerCase();

  if (main.includes("storm") || desc.includes("thunder")) return "images/heavystorm.png";
  if (desc.includes("tornado")) return "images/tyohone.png";
  if (main.includes("clear")) return "images/hotsun.png";
  if (desc.includes("few clouds")) return "images/suncloud.png";
  if (main.includes("cloud")) return "images/suntwocluds.png";
  if (desc.includes("wind") || main.includes("wind")) return "images/windy.png";
  if (desc.includes("rain") || main.includes("rain")) return "images/lightstorm.png";

  return "images/suntwocluds.png";
}
