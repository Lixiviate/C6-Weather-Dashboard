const apiKey = "dc7f919c574b660b6b15490d06db38b6";
const cityName = "Denver";

document
  .querySelector("#searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const cityInput = document.querySelector("#cityInput").value;
    getWeather(cityInput);
    console.log(cityInput);
  });

function getWeather(cityInput) {
  const queryURL = `api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${apiKey}`;
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
