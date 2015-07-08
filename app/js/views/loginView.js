/*global define*/
define([
  'jquery',
  'underscore',
  'backbone',
  'medium',
  'bootstrap',
  'text!tpl/login.html'
], function($, _, Backbone, medium, bootstrap, tpl) {
  'use strict';

  $.fn.serializeObject = function() {
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

  var LoginView = Backbone.View.extend({
    el: '#loginWrapper',
    template: _.template(tpl),

    events: {
      "click #loginBtn": "login",
      "click #registerBtn": "register"
    },

    initialize: function() {
      medium.trigger('route:add', 'login', _.bind(this.render, this));
      medium.trigger('view:add', this);
      this.render();
    },
    render: function() {
      // Compile the template using underscore
      console.log("navBar View init")
        // Load the compiled HTML into the Backbone "el"
      this.$el.html(this.template);
    },

    login: function(e) {
      e.preventDefault();
      var data = $("#login form").serializeArray();
      var formData = _.object(_.pluck(data, 'name'), _.pluck(data, 'value'));      
      medium.trigger('user:login',formData.name);

      // remoteDB = medium.get("remoteDB");
      // remoteDB.login(formData.name, formData.password).then(
      //   function(err, response) {
      //     if (err) {
      //       if (err.name === 'unauthorized') {
      //         console.log("unauthorized", err);
      //       } else {
      //         console.log(err)
      //         medium.trigger('route:nav','post');
      //       }
      //     } else {
      //       showMap();
      //     }
      //   });
    },

    register: function(e) {
      e.preventDefault();
      var data = $("#register form").serializeArray();
      var formData = _.object(_.pluck(data, 'name'), _.pluck(data, 'value'));
      var remoteDB = medium.get("remoteDB");
      medium.trigger('user:login',formData.name);
      // remoteDB.signup(
      //   formData.name,
      //   formData.password, {
      //     metadata: {
      //       email: formData.email
      //     }
      //   },
      //   function(err, response) {
      //     if (err) {
      //       if (err.name === 'conflict') {
      //         // "batman" already exists, choose another username
      //       } else if (err.name === 'forbidden') {
      //         // invalid username
      //       } else {

      //       }
      //     } else {
      //       medium.trigger('user:login',formData.name);
      //     }
      //     console.log(err, response)
      //   });
    }
  });

  return LoginView;
});