Cloudwalkers.Router = Backbone.Router.extend ({

	'routes' : {
		'channel/:id' : 'channel',
		'*path' : 'dashboard'
	},

	'initialize' : function ()
	{
		//console.log ('init');
	},

	'dashboard' : function ()
	{
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Dashboard ());	
	},

	'channel' : function (id)
	{
		var channeldata = Cloudwalkers.Session.getChannelFromId (id);

		var channel = new Cloudwalkers.Collections.Channel 
		(
			[], 
			{ 
				'id' : id, 
				'name' : channeldata.name
			}
		);

		var view = new Cloudwalkers.Views.Channel ({ 'channel' : channel });

		Cloudwalkers.RootView.setView (view);
	}

});