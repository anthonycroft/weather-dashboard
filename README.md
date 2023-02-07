# weather-dashboard
Displays current climate and 5 day forecast for major towns and cities. Uses the https://api.openweathermap.org/ API.

## Description
The app allows users to search weather conditions for locations stored in the openweathermap.org (OWM) database - currently some 200,000 locations world-wide.

Upon entering the city name a search is made to retrieve the latitude and longitude via the following URL:

https://pro.openweathermap.org/data/2.5/forecast/hourly?lat={lat}&lon={lon}&appid={API key}

, which returns the closest matched location to the user-supplied search string. To improve a matching to the required location a user can enter the city/town name followed by the 2-digit ISO 3166 country code; also known as the Aplha-2 code, for example:

London, GB

From the data received from the first call the app then makes a second API call to retrieve weather information. The following OWM API is used for this purpose:

https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

After receiving data (where available), the current and 5-day forecast weather are shown for the following data points:

- Temperature (shown in degrees Celsius)
- Wind speed
- Humidity

After a search is activated via the Search button, the input field is cleared ready for futher requests. Previous requests up to a maximum of 5 are stored in the local storage of the browser (if available) and can be re-initiated by clicking on one of the history buttons presented below the main Search button.

If a search string does not yield any data as a result of the first API (geocoding) call, then no update is made to the currently displayed weather information (if any is displayed)

## Dependencies
The app uses the following external Javascript libraries:

[jQuery](https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js)

[Moment](https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js)

## Limitations
The storage capability of the app is determined by the browser's local storage size. It should be noted that some browsers, particularly older ones, may not permit local data storage; in which case the user may wish to switch to one that does.

The app shows a limited number of data points. A future upgrade would consider adding other data points and a weather map to improve the visual affect and provide more weather detail.

## Deployed Link:

[Weather Dashboard](https://anthonycroft.github.io/weather-dashboard/)

## Repo Link:

[Repository](https://github.com/anthonycroft/weather-dashboard)

## Screenshots:

![Weather Dashboard Home Page](https://github.com/anthonycroft/weather-dashboard/blob/main/assets/images/weather-dashboard.png))
