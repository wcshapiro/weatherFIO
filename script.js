let appId = 'a9ce07845b8c6d94a8355ac16723c760'; //api key for weather
let units = 'imperial';
function searchWeather(searchTerm,searchLatitude,searchLongitude,foundCity) // fetches data and begins initialization. 
{
	fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${searchLatitude}&lon=${searchLongitude}&APPID=${appId}&units=${units}`).then(result => {
		return result.json();
	}).then(result => {
		init(result);
	})
}
function init(resultFromServer){
		switch (resultFromServer.list[0].weather[0].main) //this statement sets the background images depending on the returned weather description. 
		{
			case 'Clear':
				document.body.style.backgroundImage = 'url("Clear.jpg")';
				break;
			case 'Clouds':
				document.body.style.backgroundImage = 'url("cloudy.jpg")';
				break;
			case 'Rain':
			case 'Drizzle':
			case 'Mist':
				document.body.style.backgroundImage = 'url("rain.jpg")';
				break;
			case 'Thunderstorms':
				document.body.style.backgroundImage = 'url("storm.jpg")';
				break;
			case 'Snow':
				document.body.style.backgroundImage = 'url("snow.jpg")';
				break;
			default:
				break;
		}
	var i = 0;
	var j = 0;
	// console.log(resultFromServer.list);
	for (i = 0, j = 0; i <= 40, j <= 4; i+=8, j++) //This loop initializes elements for the whole week. 
	{
		// console.log(resultFromServer.list[i].dt_txt);
		// console.log(i);
		// console.log(j);
		let dateElement = document.getElementById('date' + j);
		let weatherDescriptionHeader = document.getElementById('weatherDescriptionHeader' + j);
		let termperatureElement = document.getElementById('temperature'+ j);
		let humidityElement = document.getElementById('humidity'+ j);
		let windSpeedElement = document.getElementById('windSpeed'+ j);
		let cityHeader = document.getElementById('cityHeader0');
		let weatherIcon = document.getElementById('documentIconImg'+ j);

		weatherIcon.src = 'http://openweathermap.org/img/w/' + resultFromServer.list[i].weather[0].icon + '.png';
		// console.log(resultFromServer.list[i].weather[0].description);
		// console.log(resultFromServer.list[i].weather[0].icon)
		let resultDescription = resultFromServer.list[i].weather[0].description;
		var d = new Date();
  		var weekday = new Array(7);
  		weekday[0] = "Sunday";
  		weekday[1] = "Monday";
  		weekday[2] = "Tuesday";
  		weekday[3] = "Wednesday";
  		weekday[4] = "Thursday";
  		weekday[5] = "Friday";
  		weekday[6] = "Saturday";
  		var n = weekday[d.getDay()+j];
		dateElement.innerText = n;
		weatherDescriptionHeader.innerText = resultDescription.charAt(0).toUpperCase() + resultDescription.slice(1);
		termperatureElement.innerHTML = Math.floor(resultFromServer.list[i].main.temp) + '&#176';
		windSpeedElement.innerHTML = 'Winds at ' + Math.floor(resultFromServer.list[i].wind.speed) + ' m/s';
		if (foundCity) {
			cityHeader.innerHTML = foundCity;

		}
		else{
			cityHeader.innerHTML = resultFromServer.city.name;
		}
			// console.log(resultFromServer.city.name);
			// console.log(foundCity)
		humidityElement.innerHTML = 'Humidity levels at ' + resultFromServer.list[i].main.humidity + '%';
		setPositionForWeatherInfo();
	}
	
}
function setPositionForWeatherInfo() { // sets the position of the weather table. 
	let bodyContainer = document.getElementById('weatherTable');
	let weatherContainer = document.getElementById('containerManager');
	let bodyContainerHeight = bodyContainer.clientHeight;
	let bodyContainerWidth = bodyContainer.clientWidth;
	// console.log("This is the body container height")
	// console.log(bodyContainerHeight);
	// console.log("This is the body container width")
	// console.log(bodyContainerWidth);
	document.getElementById('weatherTable').style.visibility = 'visible';// un-hides table
	bodyContainer.style.top = `calc(50% - ${bodyContainerHeight/1.3}px)`; // 1.3 looks a little better than 2. 
	bodyContainer.style.left = `calc(50% - ${bodyContainerWidth/2}px)`;
	
}
document.getElementById('searchBtn').addEventListener('click', () => { // listens for click on search button and begins the process by finding latitude and longitude. 
	let searchTerm = document.getElementById('searchInput').value;
	findLatLong(searchTerm)
})
function findLatLong(searchTerm) {
  var apikey = 'cc49ffb30b9c4e73ba6270e03e85cc65'; //api key for address -->> lat/long conversion. 
  var api_url = 'https://api.opencagedata.com/geocode/v1/json'; 
  var request_url = api_url
    + '?'
    + 'key=' +encodeURIComponent(apikey)
    + '&q=' + searchTerm
    + '&pretty=1'
    + '&no_annotations=1';

  // see full list of required and optional parameters:
  // https://opencagedata.com/api#forward

  var request = new XMLHttpRequest(); // request
  request.open('GET', request_url, true);

  request.onload = function() {
  // see full list of possible response codes:
  // https://opencagedata.com/api#codes

    if (request.status == 200){ 
      // Success!
		var data = JSON.parse(request.responseText);
		// console.log(data.results[0].geometry)
		let searchLatitude = data.results[0].geometry.lat;
		let searchLongitude = data.results[0].geometry.lng;
		// console.log(data.results[0].components)
		foundCity = data.results[0].components.city; // this determines what to label the city header. if search is of a city, city will be returned, if not, then the city around the lat/long will be returned.
		if (searchTerm){
			// console.log("boutta search");
			searchWeather(searchTerm,searchLatitude,searchLongitude,foundCity);
		}


    } else if (request.status <= 500){ 
    // We reached our target server, but it returned an error
                           
      console.log("unable to geocode! Response code: " + request.status);
      var data = JSON.parse(request.responseText);
      console.log(data.status.message);
    } else {
      console.log("server error");
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log("unable to connect to server");        
  };
  // console.log("made it here");
  request.send();  // make the request
}
                            