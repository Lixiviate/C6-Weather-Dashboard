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
  const queryURL = `https:/api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${apiKey}`;
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
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
    recentSearch.appendChild(button);
  });
}

function renderWeather(data) {
  const displayWeather = document.querySelector("displayWeather");
  displayWeather.innerHTML = "";

  const card = document.createElement("div");
  card.className = "col-lg-2 col-md-4 col-sm-6 mb-3";
}

renderSearchHistory();

/* <div class="col-lg-2 col-md-4 col-sm-6 mb-3">
<div class="card text-bg-secondary">
  <div class="card-header">Header</div>
  <div class="card-body">
    <h5 class="card-title">Secondary card title</h5>
    <p class="card-text">
      Some quick example text to build on the card title and make
      up the bulk of the card's content.
    </p>
  </div>
</div>
</div> */
