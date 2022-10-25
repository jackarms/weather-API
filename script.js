const key = config.KEY;
const btnEl = document.getElementById("btn");
const container = document.getElementById("container");

async function fetchWeather(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=imperial`
  );
  const weather = await response.json();
  return weather;
}

async function fetchFiveDay(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`
  );
  const fiveDay = await response.json();
  return fiveDay;
}

const getDate = function () {
  const date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  console.log(day);
  const withSlashes = [month, day, year].join("/");
  console.log(withSlashes);
  return withSlashes;
};

// Changes background display based on the time of day
const skyColor = function () {
  const d = new Date();
  let hour = d.getHours();
  console.log(hour);
  if (hour >= 19 || hour < 4) {
    container.classList.add("containerNight");
  } else if (hour >= 4 && hour < 10) {
    container.classList.add("containerMorning");
  } else if (hour >= 10 && hour < 19) {
    container.classList.add("containerDay");
  }
};

skyColor();

// Converts UNIX returned string into week day
const unixToDay = function (timeStamp) {
  const milli = timeStamp * 1000;
  const d = new Date(milli);
  return d.toLocaleString("en-US", { weekday: "long" });
};

const buildContainer = function (city, temp, humidity, wind) {
  const divEl = document.getElementById("result-div");
  const h1El = document.getElementById("result-h1");
  const h2El = document.getElementById("result-h2");
  const p1El = document.getElementById("result-p1");
  const p2El = document.getElementById("result-p2");
  const p3El = document.getElementById("result-p3");
  const p4El = document.getElementById("result-p4");
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
    container.classList.add("containerHagrid");
  }
  fetchWeather(city).then((results) => {
    const lat = results.coord.lat;
    const lon = results.coord.lon;
    fetchFiveDay(lat, lon);
    buildContainer(
      city,
      results.main.temp,
      results.main.humidity,
      results.wind.speed
    );
    fetchFiveDay(lat, lon).then((results) => {
      console.log(results);
      for (i = 1; i <= 3; i++) {
        const divEl = document.getElementById(`card${[i]}`);
        const h3El = document.getElementById(`h3-${[i]}`);
        const p1El = document.getElementById(`p${[i]}-1`);
        const p2El = document.getElementById(`p${[i]}-2`);
        const p3El = document.getElementById(`p${[i]}-3`);
        h3El.textContent = `On ${unixToDay(results.daily[i].dt)}`;
        p1El.textContent = `The temperature will be ${results.daily[i].temp.day}℉`;
        p2El.textContent = `The humidity will be ${results.daily[i].humidity}%`;
        p3El.textContent = `With a ${results.daily[i].rain}% chance of rain`;
        divEl.classList.add(`card${[i]}`);
      }
    });
  });
});
