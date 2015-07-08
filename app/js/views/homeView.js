/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'medium',
    'mapbox',
    'text!tpl/home.html'
], function($, _, Backbone, medium, L, tpl) {
    'use strict';


    var PostModel = Backbone.Model.extend({
        urlRoot: couchBase + '/mapster/_design/default/_view/byUser',
    });

    var HomeView = Backbone.View.extend({
        el: '#home',

        events: {
            "click #showAllPosts": "showAllPosts",
            "click #showMyPosts": "showMyPosts"
        },

        initialize: function() {
            medium.trigger('route:add', 'home', _.bind(this.show, this));
            medium.trigger('view:add', this);
        },
        show: function(id) {
            medium.trigger('view:show', this);
            this.render();
        },
        render: function() {
            // Compile the template using underscore
            var template = _.template(tpl, {});
            // Load the compiled HTML into the Backbone "el"
            this.$el.html(template);

            L.mapbox.accessToken = 'pk.eyJ1IjoibmlrZm0iLCJhIjoiNjgwN2EzYjE5M2MzNjViMWNiMGNhZmI0ODYwZDNmMWUifQ.JowtfSyYik14skkdhKf18w';

            var defaultCoords = [49.01, 8.41]
            var map = L.mapbox.map('allPostsMap', 'mapbox.streets').setView(defaultCoords, 13);

            map.locate();
            self = this;
            this.model = new PostModel();
            this.model.fetch({
                success: function(dat) {
                    _.each(dat.attributes.rows, function(el) {
                        self.addMarker(el.value, map);
                    });
                    $('.leaflet-marker-pane img').filter(function(i, el) {
                        return $(el).attr('alt') == 'other'
                    }).hide();
                }
            });
        },
        showAllPosts: function() {
            $('.leaflet-marker-pane img').filter(function(i, el) {
                return $(el).attr('alt') == 'other'
            }).show()
        },
        showMyPosts: function() {
            $('.leaflet-marker-pane img').filter(function(i, el) {
                return $(el).attr('alt') == 'other'
            }).hide()
        },
        addMarker: function(el, map) {
            var col,
                type;
            if (el.author == medium.get("user")) {
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
            }).on('click', function() {
                $('ul#allPosts li').removeClass('active');
                $('#' + this.options.markerID).addClass("active");
            });

            $('ul#allPosts').append($('<li>').addClass(el.author).attr('id', el._id).html('<h2>' + el.notetitle + '</h2><p>' + el.note + '</p><p style="float: right"><i>-' + el.author + '</i></p>'));

            marker.addTo(map);
        }
    });

    return HomeView;
});