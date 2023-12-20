const form = document.querySelector(".form");
const input = document.querySelector(".input");
const inputValue = input.value.trim().toLowerCase();
const API_key = "9857123742f974e2aecb7c5b4288cc5c";
const changeBtn = document.querySelector(".change_city");
const output = document.querySelector(".output");

// прослушка на форму
form.addEventListener("submit", showWeather);

// ФУНКЦИЯ ВЫВОДА ПОГОДЫ
async function showWeather(ev) {
  ev.preventDefault();
  if (input.value.trim().toLowerCase() === "") {
    return;
  }
  const cityObj = await findGeo(input.value.trim().toLowerCase());

  if (cityObj.Length === 0) {
    return;
  }

  const weatherInfo = await getWeather(cityObj[0]["lat"], cityObj[0]["lon"]);

  commonInfo(weatherInfo);
}

function commonInfo(weatherInfo) {
  const weatherData = {
    name: weatherInfo.name,
    temp: weatherInfo.main.temp,
    state: weatherInfo.weather[0].main,
    descr: weatherInfo.weather[0].description,
    icon: weatherInfo.weather[0].icon,
  };

  renderWeatherInfo(weatherData);
  //   renderLocalWeather(weatherData);

  const icon = document.querySelector(".icon");

  if (weatherData.state === "Clear") {
    icon.src = "../icon/clear.webp";
  } else if (weatherData.state === "Rain") {
    icon.src = "../icon/rain.webp";
  } else if (weatherData.state === "Mist") {
    icon.src = "../icon/mist.webp";
  } else if (weatherData.state === "Drizzle") {
    icon.src = "../icon/drizzle.webp";
  } else if (weatherData.state === "Clouds") {
    icon.src = "../icon/clouds.webp";
  }
}

// ОТРИСОВКА, ВСТАВКА ИНФЫ В КАРТОЧКУ С ПОГОДОЙ
function renderWeatherInfo(weatherData) {
  form.style.display = "none";

  const output = document.querySelector(".output");
  const icon = document.querySelector(".icon");
  const temp = document.querySelector(".temperature");
  const state = document.querySelector(".state");
  const descr = document.querySelector(".descr");
  const celsia = "°C";

  output.style.display = "block";

  icon.innerText = weatherData.icon;
  temp.innerText = Math.round(weatherData.temp) + celsia;
  state.innerText = `${weatherData.state} in ${weatherData.name}`;
  descr.innerText = weatherData.descr;
}

// ФУНКЦИЯ ПОИСКА ГОРОДА
async function findGeo(city) {
  const geoLink = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_key}`;

  const answer = await fetch(geoLink);
  const info = await answer.json();
  console.log(info);
  return info;
}

// ФУНКЦИЯ ПОЛУЧЕНИЯ ПОГОДЫ
async function getWeather(lat, lon) {
  const weatherLink = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${API_key}`;

  const answer = await fetch(weatherLink);
  const info = await answer.json();
  return info;
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      return getWeather(position.coords.latitude, position.coords.longitude);
    },
    () => console.log("ip")
  );
}

// async function getweatherdata(lat, lon) {
//   const weatherlink = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${API_key}`;

//   const response = await fetch(weatherlink);
//   const info = await response.json();
//   return info;
// }

// function renderLocalWeather(weatherData) {
//   form.style.display = "none";

//   const icon = document.querySelector(".icon");
//   const temp = document.querySelector(".temperature");
//   const state = document.querySelector(".state");
//   const descr = document.querySelector(".descr");
//   const celsia = "°C";

//   output.style.display = "block";

//   icon.innerText = weatherData.icon;
//   temp.innerText = Math.round(weatherData.temp) + celsia;
//   state.innerText = `${weatherData.state} in ${weatherData.name}`;
//   descr.innerText = weatherData.descr;
// }

changeBtn.addEventListener("click", changeBtnFunc);

function changeBtnFunc() {
  output.style.display = "none";
  form.style.display = "block";
  input.value = "";
  input.focus();
}
