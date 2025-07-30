var apikey = "&appid=0b61484c8ea3e10a2bcde29856092795";
var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var forcastUrl = "https://api.openweathermap.org/data/2.5/forecast?id=";
var storeCity = [];
var saveCity = "";
var temp = document.querySelector('#show-temp');
var humidity = document.querySelector('#show-humid');
var winds = document.querySelector('#show-wind');
var inputSearch = document.querySelector('#input-search');
var inputBtn = document.querySelector('#input-button');
var removeBtn = document.querySelector('#remove');
var showCity = document.querySelector('#show-city');
var currentIcon = document.querySelector('#weather-icon');

// Retrieve weather information with the API key
var getForecast = (location) => {
    var URL = weatherUrl + location + apikey;

    fetch(URL)
        .then(response => response.json())
        .then(data => {
            var Dates = new Date(data.dt * 1000);
            var Day = Dates.getDate();
            var Month = Dates.getMonth() + 1;
            var Year = Dates.getFullYear();
            showCity.textContent = `${data.name} (${Month}/${Day}/${Year})`;

            var tempF = (data.main.temp - 273.15) * 1.80 + 32;
            temp.innerHTML = `${tempF.toFixed(2)}&degF`;
            winds.textContent = `${data.wind.speed} MPH`;
            humidity.textContent = `${data.main.humidity}%`;

            var weathericon = data.weather[0].icon;
            var iconurl = `https://openweathermap.org/img/w/${weathericon}.png`;
            currentIcon.innerHTML = `<img src="${iconurl}">`;

            var weekly = forcastUrl + data.id + apikey;
            return fetch(weekly);
        })
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < 5; i++) {
                var date = new Date(data.list[((i + 1) * 8) - 1].dt * 1000);
                var iconcode = data.list[((i + 1) * 8) - 1].weather[0].icon;
                var iconurl = `https://openweathermap.org/img/w/${iconcode}.png`;
                var humidity = data.list[((i + 1) * 8) - 1].main.humidity;
                var winds = data.list[((i + 1) * 8) - 1].wind.speed;
                var tempC = data.list[((i + 1) * 8) - 1].main.temp;
                var tempF = (((tempC - 273.5) * 1.80) + 32).toFixed(2);

                document.querySelector(`#datecol${i}`).textContent = date;
                document.querySelector(`#imgcol${i}`).innerHTML = `<img src="${iconurl}">`;
                document.querySelector(`#tempcol${i}`).textContent = `${tempF}`;
                document.querySelector(`#humidcol${i}`).textContent = `${humidity}%`;
                document.querySelector(`#windcol${i}`).textContent = `${winds} MPH`;
            }
        });
};

// Create a city search line item
function groupCities(str) {
    var appendCity = document.createElement("li");
    appendCity.textContent = str.toUpperCase();
    appendCity.classList.add("list-group-item");
    appendCity.setAttribute("data-value", str.toUpperCase());
    document.querySelector(".list-group").appendChild(appendCity);
}

function getSearch() {
    var storedCities = JSON.parse(localStorage.getItem("cities")) || [];
    storeCity = storedCities;

    document.querySelector(".list-group").innerHTML = ""; // Clear old list

    storedCities.forEach(city => {
        groupCities(city);
    });
}

inputBtn.addEventListener("click", function () {
    var city = inputSearch.value.trim();
    if (!city) return;

    saveCity = city.toUpperCase();
    getForecast(city);

    if (!storeCity.includes(saveCity)) {
        storeCity.push(saveCity);
        localStorage.setItem("cities", JSON.stringify(storeCity));
        groupCities(saveCity);
    }

    inputSearch.value = "";
});


document.querySelector(".list-group").addEventListener("click", function (event) {
    if (event.target && event.target.matches("li.list-group-item")) {
        var city = event.target.getAttribute("data-value");
        getForecast(city);
    }
});

removeBtn.addEventListener("click", function () {
    localStorage.removeItem("cities");
    storeCity = [];
    document.querySelector(".list-group").innerHTML = "";
});

// Theme toggle logic
const themeToggle = document.getElementById('theme-toggle');

// Apply saved theme on load
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.add(`${savedTheme}-theme`);
  if (savedTheme === 'dark') {
    themeToggle.checked = true;
  }
});

setInterval(() => {
  let cloud = document.createElement("div");
  cloud.className = "cloud x" + Math.floor(Math.random() * 5 + 1);
  cloud.style.top = Math.random() * window.innerHeight + "px";
  document.getElementById("clouds").appendChild(cloud);

  setTimeout(() => cloud.remove(), 30000);
}, 4000);


window.onload = function () {
    getSearch();
    if (storeCity.length > 0) {
        getForecast(storeCity[storeCity.length - 1]);
    }
};

