var map, marker, infowindow, innerHTML;
var markers = [];
var search = "Parks";
var washingtonDC = {lat: 38.9072, lng: -77.0369};
var url = "https://api.foursquare.com/v2/venues/explore?client_id=JG3FXNYMAHZG1OVUMBZACXPP3CBVLNT2X1O0BXKGOZKRO4SA%20&client_secret=XI2JWF5HUU2CUOLITHDB2NUZ3EZXEIYML5PVCOG12IZIWNU5%20&v=20130815%20&ll=38.9072,-77.0369&query=" + search +"&radius=15000&limit=10&venuePhotos=1";
$("#h3-search").text(search[0].toUpperCase() + search.slice(1));

function ListControl(controlDiv, map) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to open locations list';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = '☰';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener('click', function() {
    openNav();
  });
};

//Initialize map
var initMap = function() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: washingtonDC,
    zoom: 12,
    mapTypeControl: true,
    mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: google.maps.ControlPosition.TOP_RIGHT
          },
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
  // Create the DIV to hold the control and call the CenterControl()
  // constructor passing in this DIV.
  var listControlDiv = document.createElement('div');
  var listControl = new ListControl(listControlDiv, map);

  listControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(listControlDiv);
};

var viewModel = function(){
  //AJAX request to build list & place markers
  $.getJSON(url, function(data) {
    var locations = data.response.groups[0].items;
    buildList(locations);
  })
  .fail(function() {
    alert("Failed to retrieve locations");
  });

  var self = this;
  //Initialize ko.observableArray for locations
  this.locationList = ko.observableArray([]);

  this.filter = ko.observable("");

  //Add locations to ko.observable
  this.buildList = function(locationArray) {
    self.locationList(locationArray);
  };

  //Add markers function
  this.placeMarkers = function(arr) {
    arr.forEach(function(location, i) {
      var position = {lat: location.venue.location.lat,
                      lng: location.venue.location.lng};
      var title = location.venue.name;
      var locationImageSize = "150x150"
      var locationImage = location.venue.photos.groups[0].items[0].prefix + locationImageSize + location.venue.photos.groups[0].items[0].suffix;
      var locationAddress = location.venue.location.formattedAddress;
      var infowindow = new google.maps.InfoWindow();
      innerHTML = "<div>";
      innerHTML += "<strong>" + title + "</strong>";
      innerHTML += '<br><img src="' + locationImage + '">';
      innerHTML += '<br><u>Address:</u>';
      innerHTML += '<br>' + locationAddress[0];
      innerHTML += '<br>' + locationAddress[1];
      innerHTML += "</div>"
      infowindow.setContent(innerHTML);
      marker = new google.maps.Marker({
        map: map,
        title: title,
        position: position,
        id: i
      });
      marker.addListener('click', function() {
        infowindow.open(map, this);
      });
      marker.addListener('click', toggleBounce);
      markers.push(marker);
    });
  };

  //Function for toggling markers between bounce/non-bounce state when marker
  //is clicked
  self.toggleBounce = function () {
    if (this.getAnimation() !== null) {
      this.setAnimation(null);
    }
    else
    {
      this.setAnimation(google.maps.Animation.BOUNCE);
    }
  };

  //Implementation of click function on clicked list item
  self.listClick = function(index) {
    markerItem = markers[index];
    var infowindow = new google.maps.InfoWindow();
    infowindow.setContent(innerHTML);
    infowindow.open(map, markerItem);
    if (markerItem.getAnimation() !== null) {
      markerItem.setAnimation(null);
    }
    else
    {
      markerItem.setAnimation(google.maps.Animation.BOUNCE);
    }
  };

  //Filter the list view
  this.filteredList = ko.computed(function() {
    var filter = this.filter().toLowerCase();
    if (!filter) {
      placeMarkers(locationList());
      return locationList();
    }
    else
    {
      for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
      };
      var filtered = ko.utils.arrayFilter(this.locationList(), function (data) {
        var lowerCasePlace = data.venue.name.toLowerCase();
        return (lowerCasePlace.includes(filter));
      });
      placeMarkers(filtered);
      return filtered;
    }
  }, this);
}

ko.applyBindings(viewModel);
