var keyFile = "/static/assets/docs/credentials";

var yelpUrlBase = "https://api.yelp.com/v3/businesses/search";
var gmapUrlBase = "http://maps.googleapis.com/maps/api/js?key=APIKEY&v=3&callback=initMap";

var LAT_DEF = 40.7413549;
var LNG_DEF = -73.9980244;

var map;

function initMap(initMapUrl) {

  // constructor creates new map: (lat,lng) + zoom only required inputs:  
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: LAT_DEF, lng: LNG_DEF},
    zoom: 13
  });

  // location definition (later can get lat/lngs from addresses)
  var tribeca = {lat: 40.719526, lng: -74.0089934}; // so use Yelp api to get vegan addresses, convert to coord, markem up

  // marker to put on map: google.maps.Marker
  var marker = new google.maps.Marker({
    position: tribeca,
    map: map,
    title: 'TRIBECKS'
  }); // later options: styled markers and animation

  // info windows constructed by google.maps.InfoWindow
  // these don't automatically open, so we add a listener
  var infowindow = new google.maps.InfoWindow({
    content: 'Howdy doody?'
  });

  marker.addListener('click', function(){
    infowindow.open(map,marker);  // args: which map? which marker? Using generic map, marker for now
  });


}

function getCred(url,callback) {

  // authentication: Google Maps API
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {            
          var cred = JSON.parse(xhr.responseText);            
          callback(cred.GOOGLE_MAPS_API_KEY); // launchMap
      }
  };
  xhr.open('GET', url, true);
  xhr.send(); // null or empty for GET

}



function launchMap(KEY) {

   // construct our fully-qualifed map url w/apikey
   var initMapUrl = gmapUrlBase.replace("APIKEY",KEY);

   /*
    Using Knockout attr binding for script src tag
    for Google Maps. Note that applying the binding here 
    will invoke initMap as it's the callback specified in 
    our url to Google.
   */
   var ViewModel = { url: ko.observable(initMapUrl) };
   ko.applyBindings(ViewModel);   
}

function main() {
  
  getCred(keyFile, launchMap);
  

}

main();