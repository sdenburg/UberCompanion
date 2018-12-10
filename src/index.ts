var Uber = require('node-uber');
var uberConfiguration = require('./UberConfiguration.json');
var GoogleMapsLoader = require('google-maps');
var $ = require('jquery');

import 'jquery-ui/ui/widgets/slider.js'

import './styles/app.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery-ui/themes/base/slider.css'
import 'jquery-ui/themes/base/base.css'
import 'jquery-ui/themes/base/core.css'
import 'jquery-ui/themes/base/all.css'

var uber = new Uber({
    client_id: uberConfiguration.client_id,
    client_secret: uberConfiguration.client_secret,
    server_token: uberConfiguration.server_token,
    redirect_uri: uberConfiguration.redirect_uri,
    name: uberConfiguration.name,
    language: 'en_US', // optional, defaults to en_US
    sandbox: false, // optional, defaults to false
    proxy: '' // optional, defaults to none
});

// Globals
var map;
var markers = [];

function setupSlider()
{
  $("#slider-range").slider({
    range: true,
    min: 0,
    max: 40,
    values: [ greenCutoff, yellowCutofff ],
    slide: function(event, ui) {
      $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
      greenCutoff = ui.values[0];
      yellowCutofff = ui.values[1];
    }
  });
  $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) + " - $" + $( "#slider-range" ).slider( "values", 1 ) );
}

function getUberPrices(google, map, startLat: number, startLng: number, endLat: number, endLng: number): void
{
  uber.estimates.getPriceForRouteAsync(startLat, startLng, endLat, endLng)
  .then(function(res) {
    var poolRide = res.prices.find((element) => { return element.display_name == "Pool"; });
    // console.log(`High: ${poolRide.high_estimate}, Low: ${poolRide.low_estimate}`);
    addUberPriceMarker(google, map, {lat: endLat, lng: endLng}, poolRide)
  })
  .error(function(err) { console.error(err); });
}

function addUberPriceMarker(google, map, location, ride)
{
  var price = (ride.high_estimate + ride.low_estimate) / 2;

  var priceMarker = new google.maps.Marker({position: location, map: map, title: price.toString()});
  colorMarker(priceMarker, price);

  markers.push(priceMarker);
}

function updateMarkerColors()
{
  markers.forEach(element => {
    colorMarker(element, element.title);
  });
}

function colorMarker(marker, price)
{
  var markerIcon;
  if (price < greenCutoff)
  {
    markerIcon = greenMarkerIcon;
  }
  else if (price < yellowCutofff)
  {
    markerIcon = yellowMarkerIcon;
  }
  else
  {
    markerIcon = redMarkerIcon;
  }

  marker.setIcon(markerIcon)
}

function populateMap(google, map)
{
  for (var lat = endLat - radius; lat <= endLat + radius; lat += spacing)
  {
    for (var lng = endLng - radius; lng <= endLng + radius; lng += spacing)
    {
      getUberPrices(google, map, startLat, startLng, lat, lng);
    } 
  }
}

function setupGoogleMap()
{
  GoogleMapsLoader.KEY = uberConfiguration.google_api_key;
  GoogleMapsLoader.load(function(google) {
    var center = { lat: startLat, lng: startLng };
    var start = { lat: startLat, lng: startLng };
    var end = { lat: endLat, lng: endLng };
    
    map = new google.maps.Map(document.getElementById('map'), {zoom: 13, center: center});
  
    var startMarker = new google.maps.Marker({position: start, map: map, icon: blueMarkerIcon});
    var endMarker = new google.maps.Marker({position: end, map: map, icon: blueMarkerIcon});

    populateMap(google, map);
  });
}

var startLat = 38.875667;
var startLng = -77.109287;
var endLat = 38.927644;
var endLng = -77.027750;

var greenCutoff = 4;
var yellowCutofff = 10;

var radius = 0.02;
var spacing = 0.0025;

var blueMarkerIcon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
var greenMarkerIcon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
var yellowMarkerIcon = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
var redMarkerIcon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';

setupSlider();
setupGoogleMap();
updateMarkerColors();

$('#updateButton').click(updateMarkerColors);
