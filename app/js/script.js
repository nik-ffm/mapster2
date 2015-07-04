 var couchBase = 'http://192.168.59.103:5984';
 var Answer = Backbone.Model.extend({
    urlRoot: couchBase + '/answer/',
    defaults: {
      "manuals": [],
      "questions": [],
      "cars": [],
      "tecalliance": false,
      "acceptable": false,
      "approvable": false,
    },
});

var remoteDB = new PouchDB('http://192.168.59.103:5984/mapster')

L.mapbox.accessToken = 'pk.eyJ1IjoibmlrZm0iLCJhIjoiNjgwN2EzYjE5M2MzNjViMWNiMGNhZmI0ODYwZDNmMWUifQ.JowtfSyYik14skkdhKf18w';

var defaultCoords = [49.01, 8.41]
var map = L.mapbox.map('allPostsMap', 'mapbox.streets').setView(defaultCoords, 13);

map.locate();

var pdb = new PouchDB('Mapster'),
    remoteDB = new PouchDB('http://192.168.59.103:5984/mapster');
//var remoteDB = new PouchDB('https://nikffm.iriscouch.com/test')

pdb.sync(remoteDB, {
    live: true,
    retry: true
}).on('change', function (info) {
    console.log('change')
  // handle change
}).on('paused', function () {
    console.log('paused')
  // replication paused (e.g. user went offline)
}).on('active', function () {
    console.log('denied')
  // replicate resumed (e.g. user went back online)
}).on('denied', function (info) {
    console.log('denied')
  // a document failed to replicate, e.g. due to permissions
}).on('complete', function() {
    console.log("synced something", pdb);

    var marker = L.marker(new L.LatLng(defaultCoords[0], defaultCoords[1]), {
        icon: L.mapbox.marker.icon({
            'marker-color': 'ff8888'
        }),
        draggable: true,
    });
    marker.on('dragend', function(e) {
        var coords = e.target._latlng;
        console.log('ended', e.target._latlng)
        $('#lat').val(coords.lat);
        $('#lng').val(coords.lng);
    });

    marker.bindPopup('Drag this marker to the place, you want your post to appear.');
    marker.addTo(map);
}).on('error', function(err) {
    console.log("error syncing something")
});


$('.navbar-header').on('click',function(){
    console.log(pdb);
})
