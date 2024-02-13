import { showModal } from "./modal.js";

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = "0de6414e690fae7771f01e2b459a118f"; //this is inactive api key

const getWeather = async (type, data) => {
  let url = null;

  switch (type) {
    case "current":
      if (typeof data === "string") {
        url = `${BASE_URL}/weather?q=${data}&units=metric&appid=${API_KEY}`;
      } else {
        url = `${BASE_URL}/weather?lat=${data.lat}&units=metric&lon=${data.lon}&appid=${API_KEY}`;
      }
      break;
    case "forecast":
      if (typeof data === "string") {
        url = `${BASE_URL}/forecast?q=${data}&units=metric&appid=${API_KEY}`;
      } else {
        url = `${BASE_URL}/forecast?lat=${data.lat}&units=metric&lon=${data.lon}&appid=${API_KEY}`;
      }
      break;
    default:
      url = `${BASE_URL}/forecast?q=${data}&appid=${API_KEY}`;
      break;
  }

  try {
    const res = await fetch(url);
    const json = await res.json();
    if (+json.cod === 200) {
      return json;
    } else {
      showModal(json.message);
    }
  } catch (error) {
    showModal(error.message);
  }
};

export default getWeather;
