// API key for OpenWeatherMap
const apiKey = "dc7f919c574b660b6b15490d06db38b6";
// Retrieve search history from local storage
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Event listener for search form
document
  .querySelector("#searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const cityInputEl = document.querySelector("#cityInput");
    const cityInput = cityInputEl.value.trim();
    if (cityInput) {
      getWeather(cityInput);
      recentSearchHistory(cityInput);
      renderSearchHistory();
      cityInputEl.value = "";
      console.log(cityInput);
    }
  });

// Fetch weather data from OpenWeatherMap API
function getWeather(cityInput) {
  const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${apiKey}&units=imperial`;
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      renderWeather(data);
    })
    .catch(function (error) {
      console.log("Error fetching data: ", error);
    });
}

// Update search history with the new city ans store in local storage
function recentSearchHistory(city) {
  searchHistory = searchHistory.filter(function (newCity) {
    return newCity !== city;
  });
  searchHistory.unshift(city);
  searchHistory = searchHistory.slice(0, 7);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

// Render search history as buttons
function renderSearchHistory() {
  const recentSearch = document.querySelector("#recentSearch");
  recentSearch.innerHTML = ""; // Clears prior search history
  searchHistory.slice(0, 7).forEach(function (city) {
    const button = document.createElement("button");
    button.className = "btn btn-light w-100 mb-1";
    button.textContent = city;
    button.onclick = function () {
      getWeather(city);
    };
    recentSearch.appendChild(button);
  });
}

// Render ans display weather data for cards
function renderWeather(data) {
  const displayWeather = document.querySelector("#displayWeather");
  displayWeather.innerHTML = "";

  // Filter weather data to get readings at noon each day
  const dayData = data.list.filter(function (filterData) {
    return filterData.dt_txt.includes("12:00:00");
  });

  // Display 5 days of weather data
  dayData.slice(0, 5).forEach(function (day, index) {
    const card = document.createElement("div");
    card.className = "col-lg-2 col-md-4 col-sm-6 mb-3";

    const weatherDate = new Date(day.dt_txt).toLocaleDateString();
    const weatherIcon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

    let cardClass = "card text-bg-secondary text-center";
    let title = "Forecast";
    if (index === 0) {
      cardClass = "card text-bg-primary text-center";
      title = "Current";
    }

    // Build the card HTML content
    card.innerHTML = `
    <div class="${cardClass}">
    <h4>${title}</h4>
    <div class="card-header">${weatherDate}</div>
    <div class="card-body">
    <div class="d-flex justify-content-center">
    <img src="${weatherIcon}" alt="Weather icon of a ${day.weather[0].description}"/>
    </div>
    <h5 class="card-title">${day.weather[0].description}</h5>
    <p class="card-text">
    Temp: ${day.main.temp} °F<br>
    Wind: ${day.wind.speed} MPH<br>
    Humidity: ${day.main.humidity}%<br>
    </p>
    </div>
    </div>`;
    displayWeather.appendChild(card);
  });
}

renderSearchHistory();
