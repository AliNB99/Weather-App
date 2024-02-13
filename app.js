import getWeekDay from "./utils/customerDate.js";
import getWeather from "./utils/httpReq.js";
import { removeModal, showModal } from "./utils/modal.js";

const weatherContainer = document.getElementById("weather");
const forecastContainer = document.getElementById("forecast");
const searchInput = document.querySelector("input");
const searchBtn = document.querySelector("button");
const locationIcon = document.getElementById("location");
const modalBtn = document.getElementById("modal-button");

const initHandler = async () => {
  const weatherData = await getWeather("current", "tehran");
  const forecastData = await getWeather("forecast", "tehran");
  renderCurrentWeather(weatherData);
  renderForecastWeather(forecastData);
};

const searchHandler = async () => {
  const cityName = searchInput.value;

  if (!cityName) {
    showModal("please enter city name");
    return;
  }

  try {
    searchInput.value = "";
    weatherContainer.innerHTML = `<span id="loader"></span>`;
    forecastContainer.innerHTML = "";

    const weatherData = await getWeather("current", cityName);
    const forecastData = await getWeather("forecast", cityName);
    if (weatherData && forecastData) {
      renderCurrentWeather(weatherData);
      renderForecastWeather(forecastData);
    }
  } catch (error) {
    showModal(error.message);
    weatherContainer.innerHTML = "<h1>please try again</h1>";
  }
};

const locationHandler = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionCallback, errorCallback);
  } else {
    showModal("location is not support");
  }
};

const positionCallback = async (position) => {
  weatherContainer.innerHTML = `<span id="loader"></span>`;
  forecastContainer.innerHTML = "";
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const weatherData = await getWeather("current", { lat, lon });
  const forecastData = await getWeather("forecast", { lat, lon });
  if (weatherData && forecastData) {
    renderCurrentWeather(weatherData);
    renderForecastWeather(forecastData);
  }
};

const errorCallback = (error) => {
  showModal(error.message);
};

const renderCurrentWeather = (data) => {
  if (!data) return;
  const weatherJSX = `
    <h1>${data.name}, ${data.sys.country}</h1>
    <div id="main">
        <img alt="weather icon" src="https://api.openweathermap.org/img/w/${
          data.weather[0].icon
        }.png"/>
        <span>${data.weather[0].main}</span>
        <p>${Math.round(data.main.temp)} °C</p>
    </div>
    <div id="info">
        <p>Humidity: <span>${data.main.humidity} %</span></p>
        <p>Wind Speed: <span>${data.wind.speed} m/s</span></p>
    </div>
  `;

  weatherContainer.innerHTML = weatherJSX;
};

const renderForecastWeather = (data) => {
  if (!data) return;
  data = data.list.filter((i) => i.dt_txt.includes("12:00:00"));
  console.log(data);

  data.forEach((i) => {
    const foreCastJSX = `
    <div>
      <img alt="weather icon" src="https://api.openweathermap.org/img/w/${
        i.weather[0].icon
      }.png"/>
      <h3>${getWeekDay(i.dt)}</h3>
      <p>${Math.round(i.main.temp)}°C</p>
      <span>${i.weather[0].main}</span>
    </div>
    `;
    forecastContainer.innerHTML += foreCastJSX;
  });
};

window.addEventListener("DOMContentLoaded", initHandler);
searchBtn.addEventListener("click", searchHandler);
locationIcon.addEventListener("click", locationHandler);
modalBtn.addEventListener("click", removeModal);
