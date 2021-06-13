// GLOBAL VARIABLES
// API
var APIKey = "42047833fa93ab4b60ef3a5ff26f282d";
var APIURL = "http://api.openweathermap.org/data/2.5/";

// Elements
var searchFormEl = $("#searchForm");
var weatherContainerEl = $("#weatherContainer");

// Tracking
var searchedCityVal;
var fiveDay = 5;

// -------------------------------------------------------------------------------
// FUNCTIONS

function displayNotFound() {
    weatherContainerEl.empty();
    weatherContainerEl.append(`
        <h3>No Results Found. Please Try Again</h3>
    `);
}

function temperatureRating(t) {
    return (t < 32 ? "tempFreeze" : (t < 50 ? "tempCold" : (t < 65 ? "tempCool" : (t < 72 ? "tempMid" : (t < 80 ? "tempWarm" : (t < 105 ? "tempHot" : "tempExt"))))));
}

function displayForecast(forecastData) {
    var forecast = [];
    for(var i = 0; i < fiveDay; i++) {
        forecast.push(`
            <div class="forecastBox ${temperatureRating(forecastData.daily[i].temp.day)}">
                <h4>${moment(forecastData.daily[i].dt, "X").format("M/D/YYYY")}</h4>
                <img src="http://openweathermap.org/img/wn/${forecastData.daily[i].weather[0].icon}@2x.png" alt="weather icon" class="icon"> 
                <p>Temp: ${forecastData.daily[i].temp.day} <span>&#176;</span> F</p>
                <p>Wind: ${forecastData.daily[i].wind_speed} MPH</p>
                <p>Humidity: ${forecastData.daily[i].humidity} %</p>    
            </div>
        `)
    }
    return forecast.join("");
}

function uvRating(uvi) {
    return (uvi < 3 ? "uvLow" : (uvi < 6 ? "uvMod" : (uvi < 8 ? "uvHigh" : (uvi < 11 ? "uvVHigh" : "uvExt"))));
}

function displayContent(weatherData) {
    weatherContainerEl.empty();
    weatherContainerEl.append(`
        <div id="currentWeatherBox">
            <h2>${searchedCityVal} (${moment().format("M/D/YYYY")})
                <img src="http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png" alt="weather icon" class="icon"> 
            </h2>
            <p>Temp: ${weatherData.current.temp} <span>&#176;</span> F</p>
            <p>Wind: ${weatherData.current.wind_speed} MPH</p>
            <p>Humidity: ${weatherData.current.humidity} %</p>
            <p>UV Index: <span class="uvColor ${uvRating(weatherData.current.uvi)}">${weatherData.current.uvi}</span></p>
        </div>
        <h3>5-Day Forecast:</h3>
        <div id="fiveDayContainer" class="d-flex justify-content-between">
            ${displayForecast(weatherData)}
        </div>
    `);
}

function searchApiByCoordinates(lat, lon) {
    var locQueryUrl = `${APIURL}onecall?${lat}&${lon}&exclude=minutely,hourly&units=imperial&appid=${APIKey}`;

    fetch(locQueryUrl)
        .then(function (response) {
            if(!response.ok) {
                displayNotFound();
                throw response.json();
            }
            return response.json();
        })
        .then(function (locRes) {
            console.log("~ locRes", locRes);
            displayContent(locRes);
        })
        .catch(function (error) {
            return error;
        });
}

function searchApiByCity(query) {
    var locQueryUrl = `${APIURL}weather?q=${query}&appid=${APIKey}`;

    fetch(locQueryUrl)
        .then(function (response) {
            if(!response.ok) {
                displayNotFound();
                throw response.json();
            }
            return response.json();
        })
        .then(function (locRes) {
            searchedCityVal = locRes.name;
            var cityLat = `lat=${locRes.coord.lat}`;
            var cityLon = `lon=${locRes.coord.lon}`;
            searchApiByCoordinates(cityLat, cityLon);
        })
        .catch(function (error) {
            return error;
        });
}

function handleSearchSubmit(event) {
    event.preventDefault();

    searchedCityVal = $("#searchInput").val();

    searchApiByCity(searchedCityVal);
}

searchFormEl.on("submit", handleSearchSubmit)