var Cloudwalkers = {

	'Views' : {
		'Settings': {},
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

		// First load essential user data
		Cloudwalkers.Session.loadEssentialData (function ()
		{
			// Root view
			Cloudwalkers.RootView = new Cloudwalkers.Views.Root();
			
			// And then rout the router.
			Cloudwalkers.Router.Instance = new Cloudwalkers.Router ();
			Backbone.history.start();
		});
	}
};