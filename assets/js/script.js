// This is our API key
var APIKey = "da32ef5f8559d578f784b0190962fefd";
var city;
var country;
var state;

  /**
 * pulls information from the form and builds the query URL
 * @returns {string} URL for openweathermap.org API based on form input
 */
function buildQueryURLForecast(coords) {

  city = coords[0].name
  countryCode = coords[0].country
  state = coords[0].state

  // console.log("country is " + country);

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

function getCoordURL() {
  let inputCity = ''; // holds the search value user entered

  // queryURL is the url we'll use to query the API
  var queryURL = "http://api.openweathermap.org/geo/1.0/direct?";

  // Build an object to contain our API call's query parameters
  // Set the API key
  var queryParams = { "appid": APIKey };

  // Grab text the user typed into the search input - store in global var for
  // later and add to query params
  inputCity = $("#search-input")
  .val()
  .trim();

  queryParams.q = inputCity;

  queryParams.limit = 1;
  // queryParams.lang = 'en';

  // Logging the URL so we have access to it for troubleshooting
  // console.log("---------------\nURL: " + queryURL + "\n---------------");
  console.log(queryURL + $.param(queryParams));
  return queryURL + $.param(queryParams);
}

function updateWeather (data) {
  var countryName = '';

  // load JSON object of ISO country codes
  $.getJSON("./assets/js/iso_country_codes.json", function(data) {
    countryName = $.grep(data, function(e){ 
      return e.code == countryCode; 
    })[0].country;

    if (countryName === undefined) {
      return 'unknown territory';
    }

    $('#city').text(`${city}, ${countryName} (${moment().format('DD/M/YYYY')})`)

  });

    // display current weather to page
    $('#current-temp').text("Temp (C): " + (data.list[0].main.temp -273.15).toFixed(2)) ;
    $('#current-wind').text("Wind: " + data.list[0].wind.speed);
    $('#current-humidity').text("Humidity: " + data.list[0].main.humidity);

    displayForecast();

    function displayForecast () {

      var forecastTime;
      var forecastData;
      
      // display 5-day forecast to page - use 12 midday as representative average of daily temp
      for (let i = 0; i < 5; i++) {

        // get the unix time for current day + i
        forecastTime = moment().add(i+1, 'day').hours(12).minutes(0).seconds(0).unix();

        // get the forecast for selected date
        forecastData = data.list.find(item => item.dt === forecastTime);

        // diplay the forecast weather for this day
        $(`#day-${i+1} ul li:nth-child(1)`).text("Temp (C): " + (forecastData.main.temp -273.15).toFixed(2)) ;
        $(`#day-${i+1} ul li:nth-child(2)`).text("Wind: " + forecastData.wind.speed);
        $(`#day-${i+1} ul li:nth-child(3)`).text("Humidity: " + forecastData.main.humidity);
        displayIcon(forecastData, i+1);
      }

    }

    function displayIcon (forecastData, day) {

      var iconCode = forecastData.weather[0].icon;
      var iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
      $(`#day-${day} img`).attr("src", iconUrl);

    }
  
    // Log the data in the console as well
    // console.log("Wind Speed: " + weatherData.wind.speed);
    // console.log("Humidity: " + weatherData.main.humidity);
    // console.log("Temperature (C): " + tempC);
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

  // Build the query URL for the ajax request to the NYT API
  var coordURL = getCoordURL();

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
  
})