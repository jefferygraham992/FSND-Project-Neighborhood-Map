var map;
var washingtonDC = {lat: 38.9072, lng: -77.0369};

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: washingtonDC,
    zoom: 13
  });
};

var viewModel = function() {
  

};

ko.applyBindings(new viewModel());
