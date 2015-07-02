L.mapbox.accessToken = 'pk.eyJ1IjoibmlrZm0iLCJhIjoiNjgwN2EzYjE5M2MzNjViMWNiMGNhZmI0ODYwZDNmMWUifQ.JowtfSyYik14skkdhKf18w';

var defaultCoords = [49.01, 8.41]
var map = L.mapbox.map('findMeMap', 'mapbox.streets')
.setView(defaultCoords,13);

var onLocationfound = function(e){
    marker.setLatLng(e.latlng);
    map.setView(marker.getLatLng(),map.getZoom()); 
};

map.on('locationfound', onLocationfound);
map.locate();

$('#findMe').on('click',function(){
map.locate();
console.log("findMe");
})

var marker = L.marker(new L.LatLng(defaultCoords[0],defaultCoords[1]), {
    icon: L.mapbox.marker.icon({
        'marker-color': 'ff8888'
    }),
    draggable: true,
    
});
marker.on('dragend', function(e){
    var coords = e.target._latlng;
        console.log ('ended',e.target._latlng)
        $('#lat').val(coords.lat);
        $('#lng').val(coords.lng);
    });

marker.bindPopup('Drag this marker to the place, you want your post to appear.');
marker.addTo(map);


$('#syncData').on('click',function(){
    console.log("sync");
    var rep = PouchDB.replicate('mydb', 'http://192.168.59.103:5984/mapster', {
      live: true,
      retry: true
    }).on('change', function (info) {
      // handle change
    }).on('paused', function () {
      // replication paused (e.g. user went offline)
    }).on('active', function () {
      // replicate resumed (e.g. user went back online)
    }).on('denied', function (info) {
      // a document failed to replicate, e.g. due to permissions
    }).on('complete', function (info) {
      // handle complete
    }).on('error', function (err) {
      // handle error
    });
})