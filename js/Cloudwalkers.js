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
		// And then rout the router.
		Cloudwalkers.Router.Instance = new Cloudwalkers.Router ();

		// First load essential user data
		Cloudwalkers.Session.loadEssentialData (function ()
		{
			// Root view
			Cloudwalkers.RootView = new Cloudwalkers.Views.Root();
			Backbone.history.start();
		});
	}
};