/*
* This is part of a data visualization project 
* for displaying seattle crime data on an interactive google maps tool
*
* Made by Scott Kuehnert
* on 2/24/12
*/

$(document).ready(initialize);

//Globals
var rectangleColors;
var rectangleCounts;
var total;

//Sets default values, initializes the map, and starts population of the visualization
function initialize() {
	bounds = new google.maps.LatLngBounds();
	//geocoder = new google.maps.Geocoder();
	
	var latlng = new google.maps.LatLng(47.664782, -122.317089);
	var myOptions = {
		maxZoom: 20,
		minZoom: 2,
		zoom: 12,
		center: latlng,
		streetViewControl: false,
		zoomControl: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	
	youAreHere = new google.maps.Marker({
		position: latlng, 
		map: map, 
		visible: false
	});
	
	infoWindow = new google.maps.InfoWindow({
		content: "Tubs",
		position: latlng
	});
	
	//Store the nautical bounds of the visualization grid
	var topLeftLat = 47.743538;
	var topLeftLng = -122.441607574; 	
	var bottomRightLat = 47.475008654;
	var bottomRightLng = -122.244496398;

	var gridWidth = bottomRightLng - topLeftLng;
	var gridHeight = topLeftLat - bottomRightLat;

	//Set resolutions of x and y components of the visualization grid 	
	var resX = 50;
	var resY = 100;
	
	//Initialize grid storage
	rectangleColors = new Array(resX * resY);
	rectangleCounts = new Array(resX * resY);
	
	total = 0;
	
	readData(topLeftLat, topLeftLng, resX, resY, gridWidth, gridHeight);
}


//Retrieve data, and parse it into a JS object
function readData(topLeftLat, topLeftLng, resX, resY, gridWidth, gridHeight) {
	
	$.getJSON("data/crimeData.json", function (data) {
		var dataObj = jQuery.parseJSON(data);
		getCounts(data, topLeftLat, topLeftLng, resX, resY, gridWidth, gridHeight);
	});
}

//Iterates over the data and stores the number of crimes that occur in each cell
function getCounts(data, topLeftLat, topLeftLng, resX, resY, gridWidth, gridHeight) {
	//Iterate through each row in the "data.data" object, and extract the 23rd and 24th value from the returned array
	var dataObj = data.data;
	var cellWidth = gridWidth/resX;
	var cellHeight = gridHeight/resY;

	$.each(dataObj, function(k, v) {
		this.resX = resX;
		this.resY = resY;

		//Keep track of total number of data points
		total = total + 1;
		
		var pointLng = parseFloat(v[22]);
		var pointLat = parseFloat(v[23]);
		
		//Determine which cell this point falls in, and store its index
		var deltaPx = pointLng - topLeftLng;
		var deltaPy = topLeftLat - pointLat;
		var xPos = parseInt(deltaPx / cellWidth);
		var yPos = parseInt(deltaPy / cellHeight);
		var index = parseInt(xPos + yPos * resX);
		
		if (xPos >= 0 && yPos >= 0 && index <= (rectangleCounts.length - 1)) { //If the point is within the grid
			//Increment the count for that rectangle
			if (typeof rectangleCounts[index] == 'undefined') {
				rectangleCounts[index] = 1;
			} else {
				rectangleCounts[index]++;
			}
			
		}
	});
	
	makeGrid(map, topLeftLat, topLeftLng, resX, resY, gridWidth, gridHeight);
}

//Renders rectangles that compose the visualization grid
function makeGrid(map, topLeftLat, topLeftLng, resX, resY, gridWidth, gridHeight) {

	var cellWidth = gridWidth / resX;
	var cellHeight = gridHeight / resY;

	//Wait until the map has completely loaded before making the grid
	google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
				
		this.topLeftLat = topLeftLat;
		this.topLeftLng = topLeftLng;
		
		this.cellWidth = cellWidth;//.004;
		this.cellHeight = cellHeight;
		
		this.resX = resX;
		this.resY = resY;

		//Traverse the visualization grid and render a colored rectangle at each cell of the grid
		var index = 0;
		for (var j = 1; j <= parseInt(this.resY); j++) { //Height 
			for (var i = 1; i <= parseInt(this.resX); i++) { //Width
				//If the count hasn't been initialized (by the readData() function) for a square, set it to 0
				if (typeof rectangleCounts[index] == 'undefined') {
					rectangleCounts[index] = 0;
				} 
				var crimeCount = rectangleCounts[index];
				
				//Store the bounds of the current cell to be rendered
				var newLng = topLeftLng + cellWidth * i;
				var newLat = topLeftLat - cellHeight * j;
				var southWest = new google.maps.LatLng(newLat, newLng - cellWidth);
				var northEast = new google.maps.LatLng(newLat + cellHeight, newLng);
				var bounds = new google.maps.LatLngBounds(southWest, northEast);
			
				//Calculate the color of the cell
				var newHSLColor = computeHSLColor(crimeCount, resX, resY);
				var newHexColor = newHSLColor.getCSSHexadecimalRGB();
				//console.log("This grid cell is color: " + newHexColor);
				
				//Create a rectangle object to be rendered on the map
				var rectangle = new google.maps.Rectangle();
				var rectOptions = {
					strokeColor: "#000000",
					strokeOpacity: 0.8,
					strokeWeight: 0.25,
					fillColor: newHexColor,
					fillOpacity: 0.25,
					map: map,
					clickable: true,
					bounds: bounds
				};
				rectangle.setOptions(rectOptions);
				rectangle.set('index', index);
				

				//Add click event listener for each rectangle.
				google.maps.event.addListener(rectangle, 'click', (function() {
					//The event handler must be wrapped in an outer function because of scope problems with the variable "this"
					return function() {
						var index = this.get('index');
						var crimeCount = rectangleCounts[index];
						
						var messageHtml = "The number of crimes committed in the clicked region between" +
										  "<span class = 'date'> 10/27/2004 </span> and" +
										  "<span class = 'date'> 03/04/2012</span>" +
										  "is: <div><em>" + crimeCount + "</em></div>";
						$("#info").html(messageHtml);
						
					}
				})());
				var index = index + 1;
			}
		}
    });
}

//Computes a color for a square with the given crime count
function computeHSLColor(crimeCount, resX, resY) {
	var crimeCountscale = .01;
	var hueScale = (1 - crimeCount*crimeCountscale);
	
	//Prevent hue from "wrapping" around on the HSL wheel
	if (hueScale < 0) {
		hueScale = 0;
	}
	
	//HSL interpolation
	var newHue = Math.ceil(hueScale * 120); //Decrement hue from green to red
	var newSat = Math.ceil(100);
	var newLum = Math.ceil(60); 

	var newHSLColor = new HSLColour(newHue, newSat, newLum, 1.0);
	return newHSLColor;
}