Cloudwalkers.Router = Backbone.Router.extend ({

	'routes' : {
		'channel/:id' : 'channel',
		'*path' : 'dashboard'
	},

	'initialize' : function ()
	{
		
	},

	'dashboard' : function ()
	{
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Dashboard ());	
	},

	'channel' : function (id)
	{
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Channel ());
	}

});