define(
	['backbone', 'Session', 'Router', 'config', 'Views/Root'],
	function (Backbone, Session, Router, config, RootView)
	{
		var Cloudwalkers = {
			
			version : 1,

			langs :
			[
				{"id": "en_EN", "name": "International English"},
				{"id": "fr_FR", "name": "Français"},
				{"id": "nl_NL", "name": "Nederlands"},
				{"id": "pt_PT", "name": "Português"}
			],

			init : function ()
			{
				//MIGRATION -> hook session to global
				Cloudwalkers.Session = Session;

				// Authentication
				var token = window.localStorage.getItem('token');
				
				//Check if there is authentication
				if(token && token.length > 9)
				{	
					Cloudwalkers.Session.authenticationtoken = token;
					
				} else{ console.log("token error", token); window.location = "/login.html";}

				// Define API root
				Cloudwalkers.Session.api = config.apiurl + Cloudwalkers.version;

				Cloudwalkers.Session.loadEssentialData (function ()
				{
					// MIGRATION
					// Root view
					Cloudwalkers.RootView = new RootView();
					
					// Url Shortener
					///Cloudwalkers.Session.UrlShortener = new Cloudwalkers.UrlShortener();

					// And then rout the router.
					Router.Instance = new Router ();

					Backbone.history.start();

				});

				return this;
			}
		};


		/**
		 *	Backbone Extension
		 *	Add authorization headers to each Backbone.sync call
		 */
		Backbone.ajax = function()
		{
			// Is there a auth token?
			if(Cloudwalkers.Session.authenticationtoken)
				
				arguments[0].headers = {
		            'Authorization': 'Bearer ' + Cloudwalkers.Session.authenticationtoken,
		            'Accept': "application/json"
		        };
		        
			return Backbone.$.ajax.apply(Backbone.$, arguments);
		};

		return Cloudwalkers;
	}
);