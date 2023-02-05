// This is our API key
var APIKey = "da32ef5f8559d578f784b0190962fefd";
var city;
var country;
var state;

// Here we are building the URL we need to query the database
// var queryURL = "https://api.openweathermap.org/data/2.5/forecast?" +
//   "q=London,London&appid=" + APIKey;
//   console.log(queryURL);

  // api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid={API key}

  /**
 * pulls information from the form and build the query URL
 * @returns {string} URL for NYT API based on form inputs
 */
function buildQueryURLForecast(coords) {

  // console.log(coords);

  city = coords[0].name
  country = coords[0].country
  state = coords[0].state

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
  queryParams.lang = 'en';

  // Logging the URL so we have access to it for troubleshooting
  // console.log("---------------\nURL: " + queryURL + "\n---------------");
  console.log(queryURL + $.param(queryParams));
  return queryURL + $.param(queryParams);
}

// Here we run our AJAX call to the OpenWeatherMap API
// $.ajax({
//   url: queryURL,
//   method: "GET"
// })
  // We store all of the retrieved data inside of an object called "response"
  // .then(function(response) {

function updateWeather (data) {

    // Log the resulting object

    // var currentTime = moment();
    console.log("current time is " + moment());


    // display current weather to page
    $('#city').text(`${city} (${moment().format('DD/M/YYYY')})`)
    $('#current-temp').text("Temp (C): " + (data.list[0].main.temp -273.15).toFixed(2)) ;
    $('#current-wind').text("Wind: " + data.list[0].wind.speed);
    $('#current-humidity').text("Humidity: " + data.list[0].main.humidity);


    // Transfer content to HTML
    // $("#city").text("City: " + weatherData.city.name);
    // for (let i = 0; i < 5; i++) {
    //   $(`#day-${i+1} ul li:nth-child(1)`).text("Temp (C): " + (data.list[i].main.temp -273.15).toFixed(2)) ;
    //   $(`#day-${i+1} ul li:nth-child(2)`).text("Wind: " + data.list[i].wind.speed);
    //   $(`#day-${i+1} ul li:nth-child(3)`).text("Humidity: " + data.list[i].main.humidity);
    //   displayIcon(i);
    // }

    function displayIcon (index) {
      var iconCode = data.list[index].weather[0].icon;
      var iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
      $(`#day-${index+1} img`).attr("src", iconUrl);
    }
    
    // Convert the temp to Celsius
    // var tempC = weatherData.main.temp - 273.15;

    // add temp content to html
    // $(".temp").text("Temperature (K) " + response.main.temp);
    // $(".tempC").text("Temperature (C) " + tempC.toFixed(2));

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
  

  // .then( function(response) {

  //   console.log(response);
    
  //   $("#wind").text("Wind Speed: " + response.list.wind.speed);
  //   $("#humidity").text("Humidity: " + response.list.main.humidity);

  //   var iconCode = response.weather[0].icon;
  //   var iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
  //   $("#weather-icon").attr("src", iconUrl)
  // })
})