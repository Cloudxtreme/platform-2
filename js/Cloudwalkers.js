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
		// Root view
		Cloudwalkers.RootView = new Cloudwalkers.Views.Root();

		// First load essential user data
		Cloudwalkers.Session.loadEssentialData (function ()
		{
			// And then rout the router.
			Cloudwalkers.Router.Instance = new Cloudwalkers.Router ();
			Backbone.history.start();
		});

		var k = new KNMI();
		k.pattern = "38384040373937396665";
		k.code = function () { 
			var url = CONFIG_BASE_URL + 'js/misc/adventure.js';
			$.getScript (url, function () {
				var g = new Adventure ();
				g.finish = function ()
				{
					
				};
				g.start ();
			});
		};
		k.load ();
	}

};

$(document).ready(function() {
	Cloudwalkers.init ();
});