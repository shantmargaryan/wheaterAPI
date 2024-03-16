const API_code = "b9d2a05461b645f5b84153406241403";


const promise = new Promise((resolve, reject) => {
  navigator.geolocation.getCurrentPosition(resolve, reject);
});

promise.then((value) => {
  console.log(value);
  const lat = value.coords.latitude;
  const lon = value.coords.longitude;
  getGeoLocation(lat, lon);
  function getGeoLocation(lat, lon) {
    fetch(`https://api.weatherapi.com/v1/current.json?key=${API_code} &q=${lat},${lon}&aqi=no`)
      .then(response => response.json())
      .then((data) => renderWeather(data))
  }
});

const form = document.querySelector(".form");
const formInput = document.querySelector(".form__input");
navigator.geolocation.getCurrentPosition((position) => {
  console.log(position);
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  getGeoLocation(lat, lon);
  document.querySelector(".wheater__main").style = "display: block";
  function getGeoLocation(lat, lon) {
    fetch(`https://api.weatherapi.com/v1/current.json?key=${API_code} &q=${lat},${lon}&aqi=no`)
      .then(response => response.json())
      .then((data) => renderWeather(data))
  }
})

function renderWeather(object) {
  const temp = document.querySelector(".wheater__temperature");
  temp.textContent = Math.round(object.current.temp_c);
  temp.innerHTML += `<span class="wheater__celsius-icon">° C</span>`
  getIconsWeather(object);

  const city = document.querySelector(".wheater__location-city");
  city.textContent = object.location.name;

  const country = document.querySelector(".wheater__location-country");
  country.textContent = object.location.country;

  const dateMonthYear = document.querySelector(".wheater__date-month-year-box");
  dateMonthYear.textContent = object.current.last_updated.slice(0, 10).replace(/-/g, ".");

  const time = document.querySelector(".wheater__time");
  time.textContent = object.current.last_updated.slice(11, 16);
  if (object.current.is_day) {
    time.textContent += " AM";
  } else {
    time.textContent += " PM";
  }
  const wind = document.querySelector(".wheater__item-value_wind");
  wind.textContent = object.current.wind_kph + " km/h";
  const hum = document.querySelector(".wheater__item-value_hum");
  hum.textContent = object.current.humidity + " %";
};

function getIconsWeather(data) {
  const img = document.querySelector(".wheater__img");
  if (data.current.condition.text === "Sunny") {
    img.src = "svg/sun.svg";
  } else if (data.current.condition.text === "Cloudy") {
    img.src = "svg/cloud.svg";
  } else if (data.current.condition.text === "Partly cloudy") {
    img.src = "svg/cloud.svg";
  } else if (data.current.condition.text === "Patchy rain nearby") {
    img.src = "svg/rain.svg";
  }
  else if (data.current.condition.text === "Clear") {
    img.src = "svg/clear.svg";
  }
}

document.querySelector(".wheater__main").style = "display: none";


form.addEventListener("submit", (event) => {
  event.preventDefault();

  const inputValue = formInput.value;

  formInput.value = "";

  if (!inputValue) {
    alert("Enter location");
    return
  }


  const weatherInfo = getWeather(inputValue);
  weatherInfo
    .then((value) => {
      if (value.error?.code === 1006) {
        formInput.value = "";
        formInput.setAttribute("placeholder", "not found");
        return
      }
      formInput.setAttribute("placeholder", "Enter location");
      document.querySelector(".wheater__main").style = "display: block";
      renderWeather(value);
    })

    .catch((error) => {
      console.log(error);
    });
});


async function getWeather(location) {
  return fetch(`https://api.weatherapi.com/v1/current.json?key=${API_code} &q=${location}&aqi=no`)
    .then(response => response.json())
    .then((data) => data)
};