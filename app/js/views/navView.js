/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'text!tpl/navbar.html'
], function ($, _, Backbone, bootstrap, tpl) {
    'use strict';

    var NavView = Backbone.View.extend({
      el: '#navBar',
      template: _.template(tpl),

      events: {
        "click .navbar-header": "test",
        "click #logout": "logout",
        "click #syncData": "sync"
      },

      initialize: function(){
        this.render();
        medium.trigger('view:add', this);
      },
      render: function(){
        // Compile the template using underscore
        console.log("navBar View init")
        // Load the compiled HTML into the Backbone "el"
        this.$el.html( this.template );
      },
      sync: function(){
          console.log("start sync");
        
          var remoteDB = medium.get("remoteDB")
          //var remoteDB = new PouchDB('https://nikffm.iriscouch.com/test')

          var pdb = medium.get("pdb")
          var remoteDB = medium.get("remoteDB")
          pdb.sync(remoteDB, { 
            live: true
          }).on('complete', function () {
            console.log("synced something")
          }).on('error', function (err) {
            console.log("error syncing something",err)
          });
      },
      logout: function(){
          medium.trigger('user:logout');
      },
    });

    return NavView;
});