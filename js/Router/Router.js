Cloudwalkers.Router = Backbone.Router.extend ({

	'routes' : {
		'channel/:id' : 'channel',
		'schedule' : 'schedule',
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

	'schedule' : function ()
	{
		var channel = new Cloudwalkers.Collections.Scheduled
		(
			[], 
			{ 
				'name' : 'Scheduled messages'
			}
		);

		var view = new Cloudwalkers.Views.Channel ({ 'channel' : channel, 'canLoadMore' : false });

		Cloudwalkers.RootView.setView (view);
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