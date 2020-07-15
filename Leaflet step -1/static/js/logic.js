var map = L.map('map', {
    center: [37.09, -95.71],
    zoom: 5
});

 var API_KEY = "pk.eyJ1IjoibmlzYXNhcGtvdGEiLCJhIjoiY2tjbXM2bmUzMDRieDJ0bXFwY2xiYzV1bCJ9.dRorDk1QH0gdVHQc2AcEqA";
 L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(map);

var queryData = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

function fillScale(mag) {
    switch(true) {
        case mag < 1:
            return '#CCFF33';
            break;
        case mag < 2:
            return '#FFFF33';
            break;
        case mag < 3:
            return '#FFCC33';
            break;
        case mag < 4:
            return '#FF9933';
            break;
        case mag < 5:
            return '#FF6633';
            break;
        default:
            return '#FF3333';
    }
}

d3.json(queryData, data => {
    console.log(data.features);
    data.features.forEach(d => {
        L.circleMarker([d.geometry.coordinates[1], d.geometry.coordinates[0]], {
            fillOpacity: 0.9,
            color: 'black',
            weight: 0.5,
            fillColor: fillScale(d.properties.mag),
            radius: d.properties.mag * 7
        }).bindPopup("Magnitude: " + d.properties.mag
                        + "<br>Location: " + d.properties.place).addTo(map);
    });
    
    var legend = L.control({ position: 'bottomright'});
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');
        var limits = [0, 1, 2, 3, 4, 5];
        
        limits.forEach((l, i) => {
            div.innerHTML +=  '<i style="background-color:' + fillScale(0) + '"></i> '
            + l + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
        });
        return div;
    };
    legend.addTo(map);
});