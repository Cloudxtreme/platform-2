define(
	['backbone', 'Session', 'Router', 'config', 'Views/Root', 'Utilities/UrlShortener'],
	function (Backbone, Session, Router, config, RootView, UrlShortener)
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
				this.Session = Session;

				// Authentication
				var token = window.localStorage.getItem('token');
				
				//Check if there is authentication
				if(token && token.length > 9)
				{	
					this.Session.authenticationtoken = token;
					
				} else{ console.log("token error", token); window.location = "/login.html";}

				// Define API root
				this.Session.api = config.apiurl + Cloudwalkers.version;

				this.Session.loadEssentialData (function ()
				{
					// Root view
					Cloudwalkers.RootView = new RootView();
					
					// Url Shortener
					Cloudwalkers.Session.UrlShortener = new UrlShortener();

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