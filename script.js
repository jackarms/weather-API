const btnEl = document.getElementById("btn");
const container = document.getElementById("container");
const key = "3727e6df52e0ca7f0482d054586ff709";
const key2 = "4413ef538f09be9e15aaa60cb6100c05";

async function fetchWeather(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=imperial`
  );
  const weather = await response.json();
  return weather;
}

async function fetchFiveDay(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${key2}`
  );
  const fiveDay = await response.json();
  console.log(fiveDay);
}

const getDate = function () {
  const date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDay();

  const withSlashes = [month, day, year].join("/");
  return withSlashes;
};

const skyColor = function () {
  const d = new Date();
  let hour = d.getHours();

  if (hour > 19 || hour < 4) {
    container.classList.add("containerNight");
  } else if (hour > 4 && hour < 10) {
    container.classList.add("containerMorning");
  } else if (hour > 10 && hour < 19) {
    container.classList.add("containerDay");
  }
};

skyColor();

const buildContainer = function (city, temp, humidity, wind) {
  const divEl = document.createElement("div");
  const h1El = document.createElement("h1");
  const h2El = document.createElement("h2");
  const p1El = document.createElement("p");
  const p2El = document.createElement("p");
  const p3El = document.createElement("p");
  const p4El = document.createElement("p");
  h1El.textContent = `${city} Weather`;
  h2El.textContent = `Today's date is ${getDate()}`;
  p1El.textContent = `The temperature is ${temp}℉`;
  p3El.textContent = `The humidity is ${humidity}%`;
  p4El.textContent = `The wind speed is ${wind}mph`;
  divEl.append(h1El, h2El, p1El, p3El, p4El);
  divEl.classList.add("results");
  container.append(divEl);
};

btnEl.addEventListener("click", () => {
  const city = document.getElementById("input").value;
  if (city == "Hogwarts") {
    alert("Ello Harry... in Honor Of That Guy Who Played Hagrid");
  }
  fetchWeather(city).then((results) => {
    console.log(results);
    const lat = results.coord.lat;
    const lon = results.coord.lon;
    fetchFiveDay(lat, lon);
    buildContainer(
      city,
      results.main.temp,
      results.main.humidity,
      results.wind.speed
    );
  });
});
