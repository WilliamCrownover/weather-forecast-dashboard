// GLOBAL VARIABLES
// API
var APIKey = "42047833fa93ab4b60ef3a5ff26f282d";
var APIURL = "http://api.openweathermap.org/data/2.5/";

// Elements
var searchFormEl = $("#searchForm");
var weatherContainerEl = $("#weatherContainer");

// Tracking
var searchedCityVal;

// -------------------------------------------------------------------------------
// FUNCTIONS

function displayNotFound() {
    weatherContainerEl.empty();
    weatherContainerEl.append(`
        <h3>No Results Found. Please Try Again</h3>
    `);
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
            <p>UV Index: <span class="uvColor">${weatherData.current.uvi}</span></p>
        </div>
        <h3>5-Day Forecast:</h3>
        <div id="fiveDayContainer" class="d-flex justify-content-between">
            <div>
                <h4>6/13/2021</h4>
                <p>Temp: 67.00 <span>&#176;</span> F</p>
                <p>Wind: 6.67 MPH</p>
                <p>Humidity: 46 %</p>    
            </div>
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