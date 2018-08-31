var map, marker, infowindow;
var markers = [];
var washingtonDC = { lat: 38.9072, lng: -77.0369 };
var url =
  "https://api.foursquare.com/v2/venues/explore?client_id=JG3FXNYMAHZG1OVUMBZACXPP3CBVLNT2X1O0BXKGOZKRO4SA%20&client_secret=XI2JWF5HUU2CUOLITHDB2NUZ3EZXEIYML5PVCOG12IZIWNU5%20&v=20130815%20&ll=38.9072,-77.0369&query=parks&radius=15000&limit=10&venuePhotos=1";

// Add a custom control to the google map for opening list menu
function ListControl(controlDiv, map) {
  // Set CSS for the control look.
  var controlUI = document.createElement("div");
  controlUI.style.backgroundColor = "#000";
  controlUI.style.cursor = "pointer";
  controlUI.title = "Click to open locations list";
  controlDiv.appendChild(controlUI);

  // Set CSS for the control text.
  var controlText = document.createElement("div");
  controlText.style.fontSize = "16px";
  controlText.style.color = "#fff";
  controlText.style.lineHeight = "38px";
  controlText.style.paddingLeft = "5px";
  controlText.style.paddingRight = "5px";
  controlText.innerHTML = "☰";
  controlUI.appendChild(controlText);

  // Setup the click event listeners: Open menu for list of locations
  controlUI.addEventListener("click", function() {
    openList();
  });
}

//* Set the width of the side list menu to 275px */
function openList() {
  document.getElementById("menuList").style.width = "275px";
}

/* Set the width of the side list menu to 0 */
function closeList() {
  document.getElementById("menuList").style.width = "0";
}

//Initialize map
function initMap() {
  //AJAX request to get locations
  $.getJSON(url, function(data) {
    var locations = data.response.groups[0].items;
    buildList(locations);
    placeMarkers(locations);
  }).fail(function() {
    alert("Failed to retrieve locations");
  });

  // Add styling to map
  var styles = [
    {
      featureType: "landscape",
      stylers: [
        {
          hue: "#F1FF00"
        },
        {
          saturation: -27.4
        },
        {
          lightness: 9.4
        },
        {
          gamma: 1
        }
      ]
    },
    {
      featureType: "road.highway",
      stylers: [
        {
          hue: "#0099FF"
        },
        {
          saturation: -20
        },
        {
          lightness: 36.4
        },
        {
          gamma: 1
        }
      ]
    },
    {
      featureType: "road.arterial",
      stylers: [
        {
          hue: "#00FF4F"
        },
        {
          saturation: 0
        },
        {
          lightness: 0
        },
        {
          gamma: 1
        }
      ]
    },
    {
      featureType: "road.local",
      stylers: [
        {
          hue: "#FFB300"
        },
        {
          saturation: -38
        },
        {
          lightness: 11.2
        },
        {
          gamma: 1
        }
      ]
    },
    {
      featureType: "water",
      stylers: [
        {
          hue: "#00B6FF"
        },
        {
          saturation: 4.2
        },
        {
          lightness: -63.4
        },
        {
          gamma: 1
        }
      ]
    },
    {
      featureType: "poi",
      stylers: [
        {
          hue: "#9FFF00"
        },
        {
          saturation: 0
        },
        {
          lightness: 0
        },
        {
          gamma: 1
        }
      ]
    }
  ];
  map = new google.maps.Map(document.getElementById("map"), {
    center: washingtonDC,
    zoom: 12,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT
    },
    styles: styles
  });
  // Create the DIV to hold the custom control and call the ListControl()
  // constructor passing in this DIV.
  var listControlDiv = document.createElement("div");
  var listControl = new ListControl(listControlDiv, map);

  listControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(listControlDiv);
}

//Add markers function
function placeMarkers(arr) {
  arr.forEach(function(location, i) {
    var position = {
      lat: location.venue.location.lat,
      lng: location.venue.location.lng
    };
    var title = location.venue.name;
    marker = new google.maps.Marker({
      map: map,
      title: title,
      position: position,
      id: i
    });
    var locationImageSize = "150x150";
    // var locationImage = location.venue.photos.groups[0].items[0].prefix +
    //                     locationImageSize +
    //                     location.venue.photos.groups[0].items[0].suffix;
    var locationAddress = location.venue.location.formattedAddress;
    // var locationMoreInfo = location.tips[0].canonicalUrl;
    var infowindowContent = "<div>";
    infowindow = new google.maps.InfoWindow();
    infowindowContent += "<strong>" + title + "</strong>";
    // infowindowContent += '<br><img src="' + locationImage + '">';
    infowindowContent += "<br><u>Address:</u>";
    infowindowContent += "<br>" + locationAddress[0];
    infowindowContent += "<br>" + locationAddress[1];
    // infowindowContent +=
    //   '<br><a href="' +
    //   locationMoreInfo +
    //   '" target="_blank">Click for more info.</a>';
    infowindowContent +=
      '<p class="attribution">Powered by <img' +
      ' src="images/Foursquare_logo.png"></p>';
    infowindowContent += "</div>";
    marker.addListener("click", toggleBounce);
    marker.addListener("click", function() {
      infowindow.setContent(infowindowContent);
      infowindow.open(map, this);
    });
    markers.push(marker);
  });
}

// Toggle marker state b/t bouncing & not bouncing
function toggleBounce() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setAnimation(null);
  }
  if (this.getAnimation()) {
    this.setAnimation(null);
  } else {
    this.setAnimation(google.maps.Animation.BOUNCE);
  }
}

//Show markers
function showMarkers(arr) {
  arr.forEach(function(location) {
    for (var i = 0; i < markers.length; i++) {
      if (location.venue.name == markers[i].title) {
        markers[i].setVisible(true);
      }
    }
  });
}

function viewModel() {
  var self = this;
  //Initialize ko.observableArray for locations
  this.locationList = ko.observableArray([]);
  this.filter = ko.observable("");

  //Add locations to ko.observable
  this.buildList = function(locationArray) {
    self.locationList(locationArray);
  };

  //Implementation of click function on clicked list item
  self.listClick = function() {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].title == this.venue.name) {
        google.maps.event.trigger(markers[i], "click");
      }
    }
  };

  //Filter the list view
  this.filteredList = ko.computed(function() {
    var filter = this.filter().toLowerCase();
    //If nothing is entered in input field, return the whole array of locations
    if (!filter) {
      showMarkers(this.locationList());
      return this.locationList();
    }
    //If text is entered, return entries that include the text entered
    else {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setVisible(false);
      }
      //Create an array of filtered locations from original array of locations
      var filtered = ko.utils.arrayFilter(this.locationList(), function(data) {
        return data.venue.name.toLowerCase().includes(filter);
      });
      showMarkers(filtered);
      return filtered;
    }
  }, this);
}

//Error handling for Google Maps
function reportError() {
  alert("Map failed to load. Please try again later.");
}

ko.applyBindings(viewModel);
openList();