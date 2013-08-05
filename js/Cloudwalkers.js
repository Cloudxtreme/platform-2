var Cloudwalkers = {

	'Views' : {
		'Widgets' : {
			'Charts' : {}
		}
	},
	'Router' : {},
	'Models' : {},
	'Collections' : {},
	'Utilities' : {},

	'init' : function ()
	{
		// Root view
		Cloudwalkers.RootView = new Cloudwalkers.Views.Root();

		// First load essential user data
		Cloudwalkers.Session.loadEssentialData (function ()
		{
			// And then rout the router.
			Cloudwalkers.Router.Instance = new Cloudwalkers.Router ();
			Backbone.history.start();
		});
	}

};

$(document).ready(function() {
	Cloudwalkers.init ();
});