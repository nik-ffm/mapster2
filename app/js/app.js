/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'offline',
    'pouchdb',
    'views/loginView',
    'views/navView',
    'views/homeView',
    'views/postView',
    'medium'
], function ($, _, Backbone,Router,Offline, PouchDB, LoginView,NavView,HomeView,PostView) {
    'use strict';

    // Our overall **AppView** is the top-level piece of UI.
    var AppView = Backbone.View.extend({

        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        el: '#app',

        initialize: function () {

            this.router = new Router();

            this.listenTo(medium, 'view:add', this.addView);
            this.listenTo(medium, 'view:show', this.showView);
            // routing
            this.listenTo(medium, 'route:add', this.addRoute);
            this.listenTo(medium, 'route:nav', this.navigate);

            this.listenTo(medium, 'user:login', this.setUser);
            this.listenTo(medium, 'user:logout', this.unsetUser);


            if (medium.get("user") === undefined) {
                var login = new LoginView();
            } else {
                this.render();
                medium.trigger('route:nav','#home');
            }   
            
            Backbone.history.start();
        },

        render: function(){
            console.log('render app')
            if (Offline.check().offline === true) {
                this.goOfflineState();
            } else {
                this.goOnlineState();
            }
            return this;
            // Load the compiled HTML into the Backbone "el"
        },


        goOfflineState: function(){
            $('#offlineNotification').show();
        },
        goOnlineState: function(){
            $('#offlineNotification').hide();
        },

        addView: function(view) {
            medium.get("views").push({
                "id":view.id,
                "view":view
            });
            this.$('.views').append(view.el);
        },

        showView: function(view) {
            // this function will show the current/next screen
            // in the future this might (should) include animations
            // and such.
            $('#app > .view').removeClass("active");
            view.$el.addClass("active");
        },

        addRoute: function(route, name, callback) {
            this.router.route(route, name, callback);
        },  

        navigate: function(fragment, options) {
            // Simply allways trigger since there is no need for us to just change history events
            options = {trigger: true};
            this.router.navigate(fragment, options);
        },

         unsetUser: function() {
            medium.unset("user");
            // Raven.setUserContext({});
        },

        setUser: function(user) {
            medium.set("user",user);

            var home = new HomeView();
            var post = new PostView();
            var nav = new NavView();
            $('#loginWrapper').hide();
            this.render();
            medium.trigger('route:nav','#home');
        },

    });

    return AppView;
});
