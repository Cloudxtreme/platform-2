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
		var channel = new Cloudwalkers.Collections.Channel ([], { 'id' : id });
		var view = new Cloudwalkers.Views.Channel ({ 'channel' : channel });

		Cloudwalkers.RootView.setView (view);
	}

});