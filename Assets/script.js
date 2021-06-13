// GLOBAL VARIABLES
// API
var APIKey = "42047833fa93ab4b60ef3a5ff26f282d";
var locQueryUrl = "http://api.openweathermap.org/data/2.5/weather?q=";

// Elements
var searchFormEl = $("#searchForm");

// -------------------------------------------------------------------------------
// FUNCTIONS

function searchApiByCity(query) {
    locQueryUrl += `${query}&appid=${APIKey}`;

    fetch(locQueryUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (locRes) {
            console.log("~ locRes", locRes);
        });
}

function handleSearchSubmit(event) {
    event.preventDefault();

    var searchedCityVal = $("#searchInput").val();

    searchApiByCity(searchedCityVal);
}

searchFormEl.on("submit", handleSearchSubmit)