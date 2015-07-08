require.config({
    baseUrl: 'js',
    paths: {
        tpl: 'tpl',
        req: 'requirements',
        text: 'requirements/text',

        // specify paths for the dependencies, this makes stuff much easier
        'jquery': 'requirements/jquery',
        'pouchdb': 'requirements/pouchdb',
        'pouchdbAuthentication': 'requirements/pouchdb.authentication',
        'bootstrap': 'requirements/bootstrap',
        'mapbox': 'requirements/mapbox',
        'offline': 'requirements/offline.min',
        'underscore': 'requirements/underscore',
        'backbone': 'requirements/backbone',
        'localStorage': 'requirements/localStorage',
        'hammerjs': 'requirements/hammer',
        'pouchNotes': 'requirements/pouchNotes'
    },
    shim: {
        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'mapbox': {
            exports: 'L'
        },
        'jquery': {
            exports: '$'
        },
        'offline': {
            exports: 'Offline'
        },
        'pouchdb': {
             exports: 'PouchDB'
        },
        'pouchdbAuthentication': {
             deps: ['pouchdb']
        },
        'pouchNotes': {
            deps: ['pouchdb'],
            exports: 'PouchNotesObj'
        },
        'bootstrap': {
            deps: ['jquery'],
            exports: '$.fn.popover'
        },
    }
});

// we only require bootstrap to make sure it is loaded and things like
// the collapsible menu work..
require(['app'], function(App) {
    //console.log("test")
     var app = new App();
});
/*
require(['bootstrap', 'router'], function(_bootstrap, AppRouter) {
    var router = AppRouter;
});*/
