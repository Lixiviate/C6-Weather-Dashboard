const apiKey = "dc7f919c574b660b6b15490d06db38b6";
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

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

function getWeather(cityInput) {
  const queryURL = `https:/api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${apiKey}&units=imperial`;
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

function recentSearchHistory(city) {
  searchHistory = searchHistory.filter(function (newCity) {
    return newCity !== city;
  });
  searchHistory.unshift(city);
  searchHistory = searchHistory.slice(0, 7);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

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

function renderWeather(data) {
  const displayWeather = document.querySelector("#displayWeather");
  displayWeather.innerHTML = "";

  const dayData = data.list.filter(function (filterData) {
    return filterData.dt_txt.includes("12:00:00");
  });

  dayData.slice(0, 5).forEach(function (day) {
    const card = document.createElement("div");
    card.className = "col-lg-2 col-md-4 col-sm-6 mb-3";

    const weatherDate = new Date(day.dt_txt).toLocaleDateString();
    const weatherIcon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

    card.innerHTML = `
    <div class="card text-bg-secondary">
    <div class="card-header">${weatherDate}</div>
    <div class="card-body">
    <img src="${weatherIcon}" alt="Weather icon of a ${day.weather[0].description}"/>
    <h5 class="card-title">${day.weather[0].description}</h5>
    <p class="card-text">
    Temp: ${day.main.temp} °F<br>
    Wind: ${day.wind.speed} MPH<br>
    Humidity: ${day.main.humidity}%<br>
    </p>
    </div>
    </div>
    </div>`;
    displayWeather.appendChild(card);
  });
}

renderSearchHistory();
