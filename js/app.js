var map;
var markers = [];
var washingtonDC = {lat: 38.9072, lng: -77.0369};

var locations = [
  {title: 'M Street Yoga', location: {lat: 38.876134, lng: -77.016488}},
  {title: 'Flow Yoga Center', location: {lat: 38.910008, lng: -77.032288}}
];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: washingtonDC,
    zoom: 13
  });

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
  }
};

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
