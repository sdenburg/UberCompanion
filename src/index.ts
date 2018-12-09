var Uber = require('node-uber');
var uberConfiguration = require('./UberConfiguration.json');
var GoogleMapsLoader = require('google-maps'); // only for common js environments

var uber = new Uber({
    client_id: uberConfiguration.client_id,
    client_secret: uberConfiguration.client_secret,
    server_token: uberConfiguration.server_token,
    redirect_uri: uberConfiguration.redirect_uri,
    name: uberConfiguration.name,
    language: 'en_US', // optional, defaults to en_US
    sandbox: true, // optional, defaults to false
    proxy: '' // optional, defaults to none
});
  
uber.estimates.getPriceForRouteAsync(38.875667, -77.109287, 38.927644, -77.027750)
.then(function(res) {
  var poolRide = res.prices.find((element) => { return element.display_name == "Pool"; });
  console.log(`High: ${poolRide.high_estimate}, Low: ${poolRide.low_estimate}`);
})
.error(function(err) { console.error(err); });
 
GoogleMapsLoader.KEY = uberConfiguration.google_api_key;
GoogleMapsLoader.load(function(google) {
  var uluru = {lat: -25.344, lng: 131.036};
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 4, center: uluru});
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({position: uluru, map: map});
});