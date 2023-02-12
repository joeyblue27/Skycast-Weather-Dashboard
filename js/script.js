 // create weather variables  
import { apiKey } from "./key.js"; 
const weatherUrl= "https://api.openweathermap.org/data/2.5/weather?q=";
const forcastUrl = "https://api.openweathermap.org/data/2.5/forecast?id=";
var showHistory= [];
var temp = document.querySelector('#show-temp');
var humidity = document.querySelector('#show-humid');
var winds = document.querySelector('#show-wind');
var inputSearch = document.querySelector('#input-search');
var inputBtn = document.querySelector('#input-button');
var removeBtn = document.querySelector('#remove');
var showCity = document.querySelector('#show-city');

const currentForecast = (location) => {
    var URL = weatherUrl + location + "&appid=" + apiKey;
        axios.get(URL)
        .then(function (response) {

     
                var Dates = new Date(response.data.dt * 1000);
                var Day = Dates.getDate();
                var Month = Dates.getMonth() + 1;
                var Year = Dates.getFullYear();
                showCity.innerHTML = response.data.name + " (" + Month + "/" + Day + "/" + Year + ") ";

                // Shows City and Date
                var tempF = (response.data.main.temp - 273.15) * 1.80 + 32;
                temp.innerHTML = ((tempF).toFixed(2)) + "&#8457" ; 
                winds.innerHTML = response.data.wind.speed + " MPH";
                humidity.innerHTML = response.data.main.humidity + "%";


        })}
             
             

    inputBtn.addEventListener("click", () => {
         currentForecast(inputSearch.value);
      
        })