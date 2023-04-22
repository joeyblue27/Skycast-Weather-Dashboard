// create weather variables  
const apikey = "&appid=0b61484c8ea3e10a2bcde29856092795";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
const forcastUrl = "https://api.openweathermap.org/data/2.5/forecast?id=";
var storeCity = [];
var saveCity="";
var temp = document.querySelector('#show-temp');
var humidity = document.querySelector('#show-humid');
var winds = document.querySelector('#show-wind');
var inputSearch = document.querySelector('#input-search');
var inputBtn = document.querySelector('#input-button');
var removeBtn = document.querySelector('#remove');
var showCity = document.querySelector('#show-city');
var currentIcon = document.querySelectorAll('#weather-icon')

// retrieve weather information with api key

const getForecast = (location) => {
  var URL = weatherUrl + location + apikey;
  axios.get(URL)
    .then(function (response) {

      var Dates = new Date(response.data.dt * 1000);
      var Day = Dates.getDate();
      var Month = Dates.getMonth() + 1;
      var Year = Dates.getFullYear();
      showCity.textContent = response.data.name + " (" + Month + "/" + Day + "/" + Year + ") ";

      var tempF = (response.data.main.temp - 273.15) * 1.80 + 32;
      temp.innerHTML = ((tempF).toFixed(2)) + "&degF";
      winds.textContent = response.data.wind.speed + " MPH";
      humidity.textContent = response.data.main.humidity + "%";
      var weathericon = response.data.weather[0].icon;
      var iconurl = "https://openweathermap.org/img/w/" + weathericon + ".png";

      $(currentIcon).html("<img src=" + iconurl + ">");

      var weekly = forcastUrl + response.data.id + apikey;
      axios.get(weekly)
        .then(function (response) {
          for (i = 0; i < 5; i++) {
            var date = new Date((response.data.list[((i + 1) * 8) - 1].dt) * 1000);
            var iconcode = response.data.list[((i + 1) * 8) - 1].weather[0].icon;
            var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
            var humidity = response.data.list[((i + 1) * 8) - 1].main.humidity;
            var winds = response.data.list[((i + 1) * 8) - 1].wind.speed;
            var tempC = response.data.list[((i + 1) * 8) - 1].main.temp;
            var tempF = (((tempC - 273.5) * 1.80) + 32).toFixed(2);

// html column for loop 

            $("#datecol" + i).html(date);
            $("#imgcol" + i).html("<img src=" + iconurl + ">");
            $("#tempcol" + i).html(tempF + "&degF");
            $("#humidcol" + i).html(humidity + "%");
            $("#windcol" + i).html(winds + "MPH");

          }

        })
    })
}

// creates a city search line item 

function groupCities(str){
  var appendCity= $("<li>"+str.toUpperCase()+"</li>");
  $(appendCity).attr("class","list-group-item");
  $(appendCity).attr("data-value",str.toUpperCase());
  $(".list-group").append(appendCity);
}

function pastCity(event){
  var cityEl=event.target;
  if (event.target.matches("li")){
    saveCity=cityEl.textContent.trim();
      getForecast(saveCity);
  }


}

// stores the city in local storage, retrieves past city.

function getSearch(){
  $("ul").empty();
  var storeCity = JSON.parse(localStorage.getItem("cityname"));
  if(storeCity!==null){
    storeCity=JSON.parse(localStorage.getItem("cityname"));
      for(i=0; i<storeCity.length;i++){
        groupCities(storeCity[i]);
      }
      saveCity=storeCity[i-1];
      getForecast(saveCity);

      
      
  }
}

// clears the city search

function removeCities(){
  
  storeCity=[];
  localStorage.removeItem("cityname");
  document.location.reload();

}

$(document).on("click",pastCity);



inputBtn.addEventListener("click", () => {
  getForecast(inputSearch.value)
  groupCities(inputSearch.value)
  })


removeBtn.addEventListener("click", () =>{
  removeCities();
} )
 
