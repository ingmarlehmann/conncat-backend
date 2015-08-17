function main(){
  var map = initializeMap();
  renderTrackerData(map);
}

function initializeMap(){
  var circle = null;
  var centerPos = [57.708870, 11.974560];
  var map = L.map('map');

  map.setView(centerPos, 13);

  L.tileLayer('https://{s}.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'iiingo.jn9kmfo4',
      accessToken: 'pk.eyJ1IjoiaWlpbmdvIiwiYSI6Im03a1NMQ2sifQ.qwVMDPU7xD5GvF2OL8cdlw'
    }).addTo(map);

  // circle = L.circleMarker(centerPos, {radius: 10});
  // circle.addTo(map);

  // var mapMoved = function (){
  //   centerPos = map.getCenter();
  //
  //   if(circle != null){
  //     map.removeLayer(circle);
  //   }
  //
  //   circle = L.circleMarker(centerPos, {radius: 20});
  //   circle.addTo(map);
  // }
  //
  // map.on('moveend', mapMoved);

  return map;
}

function renderTrackerData(map){
  $.ajax({
    url: "/api/trackerlog/2",
    cache: false
  }).done(function(json) {
    var latlngs = [];
    for(i in json){
      latlngs.push([json[i].lat, json[i].lng]);
    }

    if(latlngs.length >= 2){
      // create a red polyline from an arrays of LatLng points
      var polyline = L.polyline(latlngs, {color: 'red'});
      polyline.addTo(map);

      // add a circle marker at the last coordinate to indicate that this is the
      // current position.
      var circle = L.circleMarker(latlngs[latlngs.length-1], {radius: 10, color: 'blue'});
      circle.addTo(map);
    }

  }).fail(function(jqXHR, textStatus){
    console.log("Request failed.")
  });
}
