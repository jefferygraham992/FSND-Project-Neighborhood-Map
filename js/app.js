var map;
var washingtonDC = {lat: 38.904174, lng: -77.017021};
var url = "https://api.foursquare.com/v2/venues/explore?client_id=JG3FXNYMAHZG1OVUMBZACXPP3CBVLNT2X1O0BXKGOZKRO4SA%20&client_secret=XI2JWF5HUU2CUOLITHDB2NUZ3EZXEIYML5PVCOG12IZIWNU5%20&v=20130815%20&ll=38.904174,-77.017021&query=yoga&radius=10000&limit=10";
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: washingtonDC,
    zoom: 13
  });
  $.ajax({
      url:url,
      type: "GET",
      dataType: "json",
      success:function(result) {
          var locations = result.response.groups[0].items;
          for (var i = 0; i < locations.length; i++) {
              setMarker(locations[i]);
          }
      }
   });
  function setMarker(data)
  {
    var infowindow = new google.maps.InfoWindow({
      content: data.venue.name
    });
    var myLatLng = {lat: data.venue.location.labeledLatLngs[0].lat, lng: data.venue.location.labeledLatLngs[0].lng};
    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
    });
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  }
}

var viewModel = function(){
  var self = this;
  self.locations = ko.observableArray([
      {name: "Cleveland", latitude:41.48 , longitude:-81.67},
      {name: "Chicago", latitude: 41.88, longitude: -87.63}
  ]);
}

ko.applyBindings(viewModel);
