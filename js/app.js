var map, marker;
var markers = [];
var search = "parks";
$("#search").text(search[0].toUpperCase() + search.slice(1));
var washingtonDC = {lat: 38.904174, lng: -77.017021};
var url = "https://api.foursquare.com/v2/venues/explore?client_id=JG3FXNYMAHZG1OVUMBZACXPP3CBVLNT2X1O0BXKGOZKRO4SA%20&client_secret=XI2JWF5HUU2CUOLITHDB2NUZ3EZXEIYML5PVCOG12IZIWNU5%20&v=20130815%20&ll=38.904174,-77.017021&query=" + search +"&radius=10000&limit=10";

//Initialize map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: washingtonDC,
    zoom: 13,
    styles: [
        {
            "featureType": "landscape",
            "stylers": [
                {
                    "hue": "#F1FF00"
                },
                {
                    "saturation": -27.4
                },
                {
                    "lightness": 9.4
                },
                {
                    "gamma": 1
                }
            ]
        },
        {
            "featureType": "road.highway",
            "stylers": [
                {
                    "hue": "#0099FF"
                },
                {
                    "saturation": -20
                },
                {
                    "lightness": 36.4
                },
                {
                    "gamma": 1
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "stylers": [
                {
                    "hue": "#00FF4F"
                },
                {
                    "saturation": 0
                },
                {
                    "lightness": 0
                },
                {
                    "gamma": 1
                }
            ]
        },
        {
            "featureType": "road.local",
            "stylers": [
                {
                    "hue": "#FFB300"
                },
                {
                    "saturation": -38
                },
                {
                    "lightness": 11.2
                },
                {
                    "gamma": 1
                }
            ]
        },
        {
            "featureType": "water",
            "stylers": [
                {
                    "hue": "#00B6FF"
                },
                {
                    "saturation": 4.2
                },
                {
                    "lightness": -63.4
                },
                {
                    "gamma": 1
                }
            ]
        },
        {
            "featureType": "poi",
            "stylers": [
                {
                    "hue": "#9FFF00"
                },
                {
                    "saturation": 0
                },
                {
                    "lightness": 0
                },
                {
                    "gamma": 1
                }
            ]
        }
    ]
  });
};

var viewModel = function(){
  var self = this;
  //Get array of places from FourSquare API to build list view
  self.locations = ko.observableArray([]);
  $.getJSON(url, function(data) {
    var locationsList = data.response.groups[0].items;
    self.locations(locationsList);
    //Place markers on map using the array of places retrieved from FourSquare
    //API
    for (var i = 0; i < locationsList.length; i++) {
      // Get the position & name of location from the location array.
      var position = {lat: locationsList[i].venue.location.lat,
                      lng: locationsList[i].venue.location.lng};
      var title = locationsList[i].venue.name;
      // Create a marker per location, and put into markers array.
      var marker = new google.maps.Marker({
        map: map,
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: i
      });
      //Add listener to add bounce to selected marker
      marker.addListener('click', toggleBounce);
      // Push the marker to our array of markers.
      markers.push(marker);
    }
  });

  //Function for toggling markers between bounce/non-bounce state when marker
  //is clicked
  self.toggleBounce = function (marker) {
    if (this.getAnimation() !== null) {
      this.setAnimation(null);
    }
    else {
      this.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  //Implementation of click function on clicked list item
  self.listClick = function(index) {
    markerItem = markers[index];
    if (markerItem.getAnimation() !== null) {
      markerItem.setAnimation(null);
    }
    else {
      markerItem.setAnimation(google.maps.Animation.BOUNCE);
    }
  }
}

ko.applyBindings(viewModel);
