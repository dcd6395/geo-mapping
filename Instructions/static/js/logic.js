var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl, function (data) {
  createFeatures(data.features);
});

function createFeatures(eqData) {

  var street = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 25,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var eqArray = [];

  for (var i = 0; i < eqData.length; i++) {
    coordinates = [eqData[i].geometry.coordinates[1], eqData[i].geometry.coordinates[0]]
    properties = eqData[i].properties;

    var color = "#FF0B14";
    if (properties.mag < 1) {
      color = "#7EFF24";
    }
    else if (properties.mag < 2) {
      color = "#FFEA34";
    }
    else if (properties.mag < 3) {
      color = "#EB9551";
    }
    else if (properties.mag < 4) {
      color = "#EB641E";
    }
    else if (properties.mag < 5) {
      color = "#EB4741";
    }

    var magnitude = L.circle(coordinates, {
      fillOpacity: 1,
      color: color,
      fillColor: color,
      radius: (properties.mag * 10000)
    }).bindPopup("<h1>" + properties.place + "</h1> <hr> <h3>Magnitud: " + properties.mag.toFixed(2) + "</h3>");
    eqArray.push(magnitude);
  }

  var earthquakes = L.layerGroup(eqArray);
  var baseMaps = {
    "Street Map": street
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var earthquakeMap = L.map("map", {
    center: [42.987, -87.098],
    zoom: 5,
    layers: [street, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(earthquakemap);

  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
      grades = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+'],
      labels = [];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 0.01) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(map);

}