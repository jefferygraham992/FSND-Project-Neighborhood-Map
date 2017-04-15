var map;
var washingtonDC = {lat: 38.9072, lng: -77.0369};

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: washingtonDC,
    zoom: 13
  });
};

var viewModel = function() {
  var self = this;

  self.locations = ko.observableArray([
    {title: 'M Street Yoga', location: {lat: 38.876134, lng: -77.016488}},
    {title: 'Flow Yoga Center', location: {lat: 38.910008, lng: -77.032288}},
  ]);

};

ko.applyBindings(new viewModel());
