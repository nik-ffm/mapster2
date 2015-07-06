$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

var pdb = new PouchDB('Mapster'),
    remoteDB = new PouchDB('http://192.168.59.103:5984/mapster');

 $('#loginBtn').on('click',function(e){
  e.preventDefault();
  var data = $("#login form").serializeArray();
  var formData = _.object(_.pluck(data, 'name'), _.pluck(data, 'value'));
  remoteDB.login(formData.name, formData.password).then(
    function (err, response) {
      if (err) {
        if (err.name === 'unauthorized') {
          console.log("unauthorized",err);
        } else {
          console.log(err)
        }
      } else {
        showMap();
      }
  });
 }) 

 $('#registerBtn').on('click',function(e){
  e.preventDefault();
  var data = $("#register form").serializeArray();
  var formData = _.object(_.pluck(data, 'name'), _.pluck(data, 'value'));
  remoteDB.signup(
    formData.name, 
    formData.password, 
    { metadata : {email : formData.email }}, 
    function (err, response) {
      if (err) {
        if (err.name === 'conflict') {
          // "batman" already exists, choose another username
        } else if (err.name === 'forbidden') {
          // invalid username
        } else {
         
        }
      } else {
         showMap();
      }
      console.log(err,response)
    });
 })

 var user;
 remoteDB.getSession(function (err, response) {
  if (err) {
    // network error
    console.log('nobody is logged in',err);
  } else if (!response.userCtx.name) {
    // nobody's logged in
    console.log(err,response);
  } else{
    console.log(err,response);
    user = response.userCtx.name;
    showMap();
  } 
});

function showMap(){
  $('#loginWrapper').hide();

  this.model = new PostModel();
  this.model.fetch({success: function(dat) {
    _.each(dat.attributes.rows,function(el){
      addMarker(el.value);
      console.log("add Marker",el)
    })
  }});
}

addMarker = function(el){
  var col,
  type;
  if (el.author == user) {
    col = 'ff8888';
    type = 'self';
  } else {
    col = '8888ff';
    type = 'other';
  }

  var marker = L.marker(new L.LatLng(el.lat, el.lng), {
        markerID: el._id,
        icon: L.mapbox.marker.icon({
            'marker-color': col
        }),
        alt: type
  }).on('click',function(){
    $('ul#allPosts li').removeClass('active');
    $('#'+this.options.markerID).addClass("active");
  });

  $('ul#allPosts').append($('<li>').attr('id',el._id).html('<h2>'+el.notetitle+'</h2><p>'+el.note+'</p><p style="float: right"><i>-'+el.author+'</i></p>'));

  marker.addTo(map);
}
  
var PostModel = Backbone.Model.extend({
    urlRoot: couchBase + '/mapster/_design/default/_view/byUser',
});

L.mapbox.accessToken = 'pk.eyJ1IjoibmlrZm0iLCJhIjoiNjgwN2EzYjE5M2MzNjViMWNiMGNhZmI0ODYwZDNmMWUifQ.JowtfSyYik14skkdhKf18w';

var defaultCoords = [49.01, 8.41]
var map = L.mapbox.map('allPostsMap', 'mapbox.streets').setView(defaultCoords, 13);



map.locate();





$('#showAllPosts').on('click',function(){
  $('.leaflet-marker-pane img').filter(function(i,el){return $(el).attr('alt') == 'other'}).show()
})
$('#showMyPosts').on('click',function(){
  $('.leaflet-marker-pane img').filter(function(i,el){return $(el).attr('alt') == 'other'}).hide()
})




//var remoteDB = new PouchDB('https://nikffm.iriscouch.com/test')
/*
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
});*/


$('.navbar-header').on('click',function(){
    console.log(pdb);
})
