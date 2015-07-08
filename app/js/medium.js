define(['backbone', 
    'pouchdb',
    'pouchdbAuthentication',
    'localStorage', 
    'config'], function(Backbone, PouchDB) {

         var apiBase = 'http://46.101.251.178';
         var couchBase = apiBase+':5984';
         var userView = 'mapster'
        // the medium object carries some properties for common
        // access, i.e. the currently active user.
        var Medium = Backbone.Model.extend({
            defaults: {
                // we need the id for local storage to work.
                'id': 0,
                //'user': undefined,
                'user': undefined,
                // baseString for the API without trailing slash
                // 'apiBase': 'https://tecbackend.julohosted.net',
                'apiBase': 'http://192.168.59.103:5004',
                'views': [],
                'pdb': new PouchDB(userView),
                'remoteDB': new PouchDB(couchBase+/+userView)
            },

            // store this data in the cache, so that it is saved between
            // sessions
            localStorage: new Backbone.LocalStorage('mapster'),

            initialize: function() {
                // fetch on start
                this.fetch();
            },
        });

        // initialize our medium
        medium = new Medium();
        console.log(medium.get("remoteDB").login)

        // we will use this medium object for communication between components
        // using signals, also see backbone events documentation
        // our signals definitely need some structure, so far we have:
        // app:start is sent when the app is started
        // user:login when a user was logged in
        // view:show <instance> should be sent when a view should
        //      be activated (which will then be handled by the app)
        _.extend(medium, Backbone.Events);

        return medium;
    });
