// This is our API key
var APIKey = "da32ef5f8559d578f784b0190962fefd";
var city;
var country;
var countryCode = '';
var countryName = '';
const unknownTerritory = 'unknown territory'

$(document).ready(function() {
  // Your code to be executed when the document is ready

  init();
});

function init() {
  // display any previous request history buttons
  var parsedObj = getHistory('cities');

  addHistoryButton(parsedObj);

}

  /**
 * pulls information from the form and builds the query URL
 * @returns {string} URL for openweathermap.org API based on form input
 */
function buildQueryURLForecast(coords) {

  city = coords[0].name
  countryCode = coords[0].country

  // queryURL is the url we'll use to query the API
  var queryURL = "https://api.openweathermap.org/data/2.5/forecast?";

  // Build an object to contain our API call's query parameters
  // Set the API key
  var queryParams = { "appid": APIKey };

  // Grab text the user typed into the search input, add to the queryParams object
  queryParams.lat = coords[0].lat
  queryParams.lon = coords[0].lon
  queryParams.lang = 'en';

  // Logging the URL so we have access to it for troubleshooting
  console.log("---------------\nURL: " + queryURL + "\n---------------");
  console.log(queryURL + $.param(queryParams));
  return queryURL + $.param(queryParams);
}

function getCoordURL(searchCity) {
  let inputCity = ''; // holds the search value user entered

  // queryURL is the url we'll use to query the API
  var queryURL = "https://api.openweathermap.org/geo/1.0/direct?";

  // Build an object to contain our API call's query parameters
  // Set the API key
  var queryParams = { "appid": APIKey };

  queryParams.q = searchCity;

  queryParams.limit = 1;

  // Logging the URL so we have access to it for troubleshooting
  console.log("---------------\nURL: " + queryURL + "\n---------------");
  console.log(queryURL + $.param(queryParams));
  return queryURL + $.param(queryParams);
}

function updateWeather (data) {

  // load JSON object of ISO country codes
  $.getJSON("./assets/js/iso_country_codes.json", function(data) {
    countryName = $.grep(data, function(e){ 
      return e.code == countryCode; 
    })[0].country;

    if (countryName === '') {
      countryName = unknownTerritory;
    }

    $('#city').text(`${city}, ${countryName} (${moment().format('DD/M/YYYY')})`)

    updateHistory(city, countryName)

  });

  displayCurrentWeather(); // display the current weather
  displayForecast(); // display the forecast

  function displayCurrentWeather () {
    // display current weather to page

    forecastData = data.list[0];
    displayIcon(forecastData, 0, 4); // displays weather icon for current time/day

    $('#current-temp').text("Temp (C): " + (data.list[0].main.temp -273.15).toFixed(2));
    $('#current-wind').text("Wind: " + data.list[0].wind.speed);
    $('#current-humidity').text("Humidity: " + data.list[0].main.humidity);
  }
    
  function displayForecast () {

    var forecastTime;
    var forecastData;
    
    // display 5-day forecast to page - use 12 midday as representative average of daily temp
    for (let i = 1; i < 6; i++) {

      // get the unix time for current day + i
      if (i != 5 ) {
        forecastTime = moment().add(i, 'day').hours(12).minutes(0).seconds(0).unix();
      } else {
        const hour = getLatestHour(moment().format('H'))
       
        forecastTime = moment().add(i, 'day').hours(hour).minutes(0).seconds(0).unix();
      }

      // get the forecast for selected date
      forecastData = data.list.find(item => item.dt === forecastTime);

      // diplay the forecast weather for this day
      $(`#day-${i} h2`).text(moment().add(i, 'days').format("ddd Do"));
      $(`#day-${i} ul li:nth-child(1)`).text("Temp (C): " + (forecastData.main.temp -273.15).toFixed(2)) ;
      $(`#day-${i} ul li:nth-child(2)`).text("Wind:     " + forecastData.wind.speed);
      $(`#day-${i} ul li:nth-child(3)`).text("Humidity: " + forecastData.main.humidity);
      displayIcon(forecastData, i);
    }
  }

  function getLatestHour (currentHour) {
    // gets the latest foreacast hour that is available from API
    
    const hours24 = [0, 3, 6, 9, 12, 15, 18, 21, 24]

    for (const num of hours24) {
      if (num > currentHour) {
        return num - 3;
      }
    }
  }

  function displayIcon (forecastData, day, magnification = 2) {

    var iconCode = forecastData.weather[0].icon;
    var iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@" + `${magnification}` + "x.png";
    $(`#day-${day} img`).attr("src", iconUrl);

  }

    // Log the data in the console as well
    // console.log("Wind Speed: " + forecastData.wind.speed);
    // console.log("Humidity: " + forecastData.main.humidity);
    // console.log("Temp: " + forecastData.main.temp -273.15).toFixed(2))

}

function updateHistory(city, countryName) {
  // adds buttons for last 5 cities requested
  var formattedCity;
  const maxCities = 5;
  const key = 'cities';
  // var maxStored = false;

  // get a string in the correct format to compare with previously stored cities
  if (countryName === unknownTerritory || countryName === '') {
    formattedCity = city;
  } else {
    formattedCity = city + ", " + countryName;
  }

  // const key = "cities"; // key for storing requested cities
  // const storedString = localStorage.getItem(key);

  parsedObj = getHistory(key);
  if (parsedObj !== {}) {
    // var parsedObj = {}; // set up a new cities array
    console.log("we are not an empty string");
    // we should have an array of cities - so parse it
    // parsedObj = JSON.parse(storedString);

    let cities = Object.values(parsedObj);

    if (cities.includes(formattedCity)) {
      addHistoryButton(parsedObj);
      return;
    }
  
    // current city is not in stored object so process.
    
    // add last value to a new incremented key (it will get overwritten in next step otherwise)
    if (cities.length < maxCities) {
      // create a new city object, storing the last object into it
      parsedObj[cities.length] = parsedObj[cities.length -1];
    }

    // move values so they are in next key position (keys are 0 - 4), e.g value in key 0 moves to Key 1

    if (cities.length > 1) {
      for (let i = cities.length -1; i > 0; i--) {
        parsedObj[i] = parsedObj[i - 1]
      } 
    } else { // deal with scenario where we only have one key
      parsedObj[1] = parsedObj[0];
    }

  }

  parsedObj[0] = formattedCity;

  localStorage.removeItem(key);
  localStorage.setItem(key, JSON.stringify(parsedObj));

  addHistoryButton(parsedObj);

}


function getHistory (key) {

  // const key = "cities"; // key for storing requested cities
  const storedString = localStorage.getItem(key);

  if (storedString === null) {
    return {}; // return empty object
  } else {
    // return parsed string
    return JSON.parse(storedString);
  }

}

function addHistoryButton (Obj) {
  const key = "cities"; // key for storing requested cities

  if (Obj == {} || Obj === undefined) {
    return;
  }
  
  // clear the history 
  $("#history").empty();
  console.log("we added history")
  // add buttons in order of the key values
  $.each(Obj, function(key, value) {
    $("<button>").text(Obj[key])
    .addClass("btn btn-secondary mb-3 btn-block")
    .attr("type", "submit")
    .appendTo("#history");
  })

}

function activateSearch (searchCity) {
  // Build the query URL for the ajax request to the NYT API
  var coordURL = getCoordURL(searchCity);

  // Make the AJAX request to the API - GETs the JSON data at the queryURL.
  // The data then gets passed as an argument to the updatePage function
  $.ajax({
    url: coordURL,
    method: "GET"
  })
  .then(buildQueryURLForecast)
  .then(forecastURL => 
    $.ajax({
    url: forecastURL,
    method: "GET"
  }))
  .then(data => updateWeather(data))
  
}

  // CLICK HANDLERS
// ==========================================================

// .on("click") function associated with the Search Button
$("#run-search").on("click", function(event) {
  // This line allows us to take advantage of the HTML "submit" property
  // This way we can hit enter on the keyboard and it registers the search
  // (in addition to clicks). Prevents the page from reloading on form submit.
  event.preventDefault();

  // Empty the region associated with the articles
  // clear();

    // Grab text the user typed into the search input
  var inputCity = $("#search-input")
    .val()
    .trim();

  // start search
  activateSearch(inputCity);

})

$("#history").on("click", "button", function() {
  // Your code to be executed on button click
  
  // get the city name from button text
  var searchCity = $(this).text();
  console.log("search city is " + searchCity);
  // start search
  activateSearch(searchCity);

});

