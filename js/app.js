var map, marker, infowindow;
var markers = [];
var search = "museums";
var washingtonDC = {lat: 38.9072, lng: -77.0369};
var url = "https://api.foursquare.com/v2/venues/explore?client_id=JG3FXNYMAHZG1OVUMBZACXPP3CBVLNT2X1O0BXKGOZKRO4SA%20&client_secret=XI2JWF5HUU2CUOLITHDB2NUZ3EZXEIYML5PVCOG12IZIWNU5%20&v=20130815%20&ll=38.9072,-77.0369&query=" + search +"&radius=10000&limit=10&venuePhotos=1";
$("#h3-search").text(search[0].toUpperCase() + search.slice(1));

// Add a custom control to the google map for opening list menu
function ListControl(controlDiv, map) {
  // Set CSS for the control look.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#000';
  controlUI.style.cursor = 'pointer';
  controlUI.title = 'Click to open locations list';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control text.
  var controlText = document.createElement('div');
  controlText.style.fontSize = '16px';
  controlText.style.color = '#fff';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = '☰';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: Open menu for list of locations
  controlUI.addEventListener('click', function() {
    openList();
  });
};

//Initialize map
function initMap() {
  //AJAX request to get locations
  $.getJSON(url, function(data) {
    var locations = data.response.groups[0].items;
    buildList(locations);
  })
  .fail(function() {
    alert("Failed to retrieve locations");
  });

  // Add styling to map
  var styles = [
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
  ];
  map = new google.maps.Map(document.getElementById('map'), {
    center: washingtonDC,
    zoom: 13,
    mapTypeControl: true,
    mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: google.maps.ControlPosition.TOP_RIGHT
          },
    styles: styles
  });
  // Create the DIV to hold the custom control and call the ListControl()
  // constructor passing in this DIV.
  var listControlDiv = document.createElement('div');
  var listControl = new ListControl(listControlDiv, map);

  listControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(listControlDiv);
};

function viewModel(){
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
      marker = new google.maps.Marker({
        map: map,
        title: title,
        position: position,
        id: i
      });
      var locationImageSize = "150x150"
      var locationImage = location.venue.photos.groups[0].items[0].prefix
                          + locationImageSize
                          + location.venue.photos.groups[0].items[0].suffix;
      var locationAddress = location.venue.location.formattedAddress;
      var locationWebAddress = location.venue.url;
      var infowindowContent = "<div>";
      infowindow = new google.maps.InfoWindow();
      infowindowContent += "<strong>" + title + "</strong>";
      infowindowContent += '<br><img src="' + locationImage + '">';
      infowindowContent += '<br><u>Address:</u>';
      infowindowContent += '<br>' + locationAddress[0];
      infowindowContent += '<br>' + locationAddress[1];
      infowindowContent += '<br><a href="' + locationWebAddress +'" target="_blank">Click for more info.</a>';
      infowindowContent += "</div>"
      marker.addListener('click', toggleBounce);
      marker.addListener('click', function() {
        infowindow.setContent(infowindowContent);
        infowindow.open(map, this);
      });
      markers.push(marker);
    });
    // Toggle marker state b/t bouncing & not bouncing
    function toggleBounce() {
      for (var i = 0; i < markers.length; i++) {
          markers[i].setAnimation(null);
      };
      if (this.getAnimation()) {
        this.setAnimation(null);
      }
      else {
        this.setAnimation(google.maps.Animation.BOUNCE);
      }
    };
  };

  //Implementation of click function on clicked list item
  self.listClick = function() {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].title == this.venue.name) {
        google.maps.event.trigger(markers[i], 'click');
      }
    }
  };

  //Filter the list view
  this.filteredList = ko.computed(function() {
    var filter = this.filter().toLowerCase();
    //If nothing is entered in input field, return the whole array of locations
    if (!filter) {
      placeMarkers(locationList());
      return this.locationList();
    }
    //If text is entered, return entries that include the text entered
    else
    {
      for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
      };
      //Create an array of filtered locations from original array of locations
      var filtered = ko.utils.arrayFilter(this.locationList(), function (data) {
        return (data.venue.name.toLowerCase().includes(filter));
      });
      placeMarkers(filtered);
      return filtered;
    }
  }, this);
}

ko.applyBindings(viewModel);
