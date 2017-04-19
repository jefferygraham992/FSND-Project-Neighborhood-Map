var map;
var markers = [];
var washingtonDC = {lat: 38.9072, lng: -77.0369};

var locations = [
  {title: 'M Street Yoga', location: {lat: 38.876134, lng: -77.016488}},
  {title: 'Flow Yoga Center', location: {lat: 38.910008, lng: -77.032288}}
];

var map;
var washingtonDC = {lat: 38.9072, lng: -77.0369};
// Create a new blank array for all the listing markers.
var markers = [];
function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: washingtonDC,
    zoom: 12
  });
  // These are the real estate listings that will be shown to the user.
  // Normally we'd have these in a database instead.
  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();
  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    bounds.extend(markers[i].position);
  }
  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);
}
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
    });
  }
}

function yogaLocation(value) {
  this.name = ko.observable(value.name);
  this.lat = ko.observable(value.lat);
  this.lng = ko.observable(value.lng);
}

var viewModel = function() {
  var self = this;

  this.placesList = ko.observableArray([]);

  locations.forEach(function(location){
    self.placesList.push(location);
  });

};

ko.applyBindings(new viewModel());
