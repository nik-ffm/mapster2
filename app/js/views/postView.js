/*global define*/
define([
  'jquery',
  'underscore',
  'backbone',
  'medium',
  'bootstrap',
  'mapbox',
  'pouchNotes',
  'text!tpl/post.html'
], function($, _, Backbone, medium, bootstrap, L, PouchNotesObj, tpl) {
  'use strict';



  var PostView = Backbone.View.extend({
    el: '#post',
    initialize: function() {
      medium.trigger('route:add', 'post', _.bind(this.show, this));
      medium.trigger('view:add', this);
    },
    show: function(id) {
      this.render();
      medium.trigger('view:show', this);
    },

    render: function() {
      // Compile the template using underscore
      var template = _.template(tpl);
      // Load the compiled HTML into the Backbone "el"
      this.$el.html(template({user: medium.get("user")}));
      this.listenToForm();
      this.activateMap();


    },
    activateMap: function() {
      L.mapbox.accessToken = 'pk.eyJ1IjoibmlrZm0iLCJhIjoiNjgwN2EzYjE5M2MzNjViMWNiMGNhZmI0ODYwZDNmMWUifQ.JowtfSyYik14skkdhKf18w';

      var defaultCoords = [49.01, 8.41]
      var map = L.mapbox.map('findMeMap', 'mapbox.streets')
        .setView(defaultCoords, 13);

      var onLocationfound = function(e) {
        marker.setLatLng(e.latlng);
        map.setView(marker.getLatLng(), map.getZoom());
        $('#lat').val(e.latlng.lat);
        $('#lng').val(e.latlng.lng);
      };

      map.on('locationfound', onLocationfound);
      map.locate();

      $('#findMe').on('click', function() {
        map.locate();
        console.log("findMe");
      })

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

    },
    listenToForm: function() {
      var buttonmenu, editbutton,
        delbutton, svhandler, viewnotes;

      viewnotes = document.querySelector('[data-show="#allnotes"]');
      buttonmenu = document.getElementById('buttonwrapper');
      editbutton = document.querySelector('button[type=button].edit');
      delbutton = document.querySelector('button[type=button].delete');

      showview = document.querySelectorAll('button.clicktarget');


      /*------ Maybe do in a try-catch ? ------*/

      var remoteDB = medium.get("remoteDB");
      console.log(PouchNotesObj);
      var pn = new PouchNotesObj(medium.get("pdb"), remoteDB);

      pn.formobject = document.getElementById('noteform');
      pn.notetable = document.getElementById('notelist');
      pn.errordialog = document.getElementById('errordialog');

      pn.formobject.addEventListener('submit', function(e) {
        e.preventDefault();
        pn.savenote();
        medium.trigger('nav:route', 'home')
      });

      pn.formobject.addEventListener('reset', function(e) {
        var disableds = document.querySelectorAll('#noteform [disabled]');
        e.target.classList.remove('disabled');
        Array.prototype.map.call(disableds, function(o) {
          o.removeAttribute('disabled');
        });
        pn.hide('#attachments');
        document.getElementById('attachmentlist').innerHTML = '';
      });

      window.addEventListener('hashchange', function(e) {
        var noteid;
        if (window.location.hash.replace(/#/, '')) {
          noteid = window.location.hash.match(/\d/g).join('');
          pn.viewnote(noteid);
        }
      });

      svhandler = function(evt) {
        var attchlist = document.getElementById('attachmentlist');

        if (evt.target.dataset.show) {
          pn.show(evt.target.dataset.show);
        }
        if (evt.target.dataset.hide) {
          pn.hide(evt.target.dataset.hide);
        }

        if (evt.target.dataset.action) {
          pn[evt.target.dataset.action]();
        }

        if (evt.target.dataset.show === '#addnote') {
          pn.formobject.reset();

          /* Force reset on hidden fields. */
          pn.formobject._id.value = '';
          pn.formobject._rev.value = '';
        }
        pn.hide('#attachments');
        attchlist.innerHTML = '';
        pn.resethash();
      };

      /* TO DO: Refactor these click actions to make the functions reusable */

      editbutton.addEventListener('click', function(e) {
        pn.formobject.classList.remove('disabled');

        Array.prototype.map.call(pn.formobject.querySelectorAll('input, textarea'), function(i) {
          if (i.type !== 'hidden') {
            i.removeAttribute('disabled');
          }
        });
      });

      delbutton.addEventListener('click', function(e) {
        pn.deletenote(+e.target.form._id.value);
        location.href = "admin.html";
      });

      Array.prototype.map.call(showview, function(ct) {
        ct.addEventListener('click', svhandler);
      });

      Array.prototype.map.call(document.getElementsByClassName('dialog'), function(d) {
        d.addEventListener('click', function(evt) {
          if (evt.target.dataset.action === 'close') {
            d.classList.add('hide');
          };
        });
      });


      pn.formobject.addEventListener('change', function(event) {
        if (event.target.type === 'file') {
          var fn = event.target.value.split('\\');
          document.querySelector('.filelist').innerHTML = fn.pop();
        }
      });
    }
  });

  return PostView;
});