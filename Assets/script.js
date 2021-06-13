// GLOBAL VARIABLES
// API
var APIKey = "42047833fa93ab4b60ef3a5ff26f282d";
var APIURL = "http://api.openweathermap.org/data/2.5/";

// Elements
var searchFormEl = $("#searchForm");
var weatherContainerEl = $("#weatherContainer");

// -------------------------------------------------------------------------------
// FUNCTIONS

function displayNotFound() {
    console.log("here");
    weatherContainerEl.append(`
        <h3>No Results Found. Please Try Again</h3>
    `);
}

function displayContent(weatherData) {
    
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

    var searchedCityVal = $("#searchInput").val();

    searchApiByCity(searchedCityVal);
}

searchFormEl.on("submit", handleSearchSubmit)