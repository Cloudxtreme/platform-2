Cloudwalkers.Router = Backbone.Router.extend ({

	'routes' : {
		'channel/:channel(/:stream)' : 'channel',
		'schedule' : 'schedule',
		'drafts' : 'drafts',
		'users' : 'users',
		'write' : 'write',
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

		var widgetcontainer = new Cloudwalkers.Views.Widgets.WidgetContainer ();

		var widget = new Cloudwalkers.Views.Widgets.MessageList ({ 'channel' : channel, 'color' : 'blue' });
		widgetcontainer.addWidget (widget);

		widgetcontainer.navclass = 'schedule';

		Cloudwalkers.RootView.setView (widgetcontainer); 
	},

	'drafts' : function ()
	{
		var collection = new Cloudwalkers.Collections.Drafts
		(
			[], 
			{ 
				'name' : 'Draft messages'
			}
		);

		var widgetcontainer = new Cloudwalkers.Views.Widgets.WidgetContainer ();

		var widget = new Cloudwalkers.Views.Widgets.MessageList ({ 'channel' : collection, 'color' : 'blue' });
		widgetcontainer.addWidget (widget);

		widgetcontainer.navclass = 'drafts';

		Cloudwalkers.RootView.setView (widgetcontainer); 
	},

	'channel' : function (id, streamid)
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

		var filters = {};
		if (typeof (streamid) != 'undefined')
		{
			filters['streams'] = [ streamid ];
			channel.setFilters (filters);	
		}

		var widgetcontainer = new Cloudwalkers.Views.Widgets.WidgetContainer ();

		var widget = new Cloudwalkers.Views.Widgets.Timeline ({ 'channel' : channel, 'color' : 'blue' });
		widgetcontainer.addWidget (widget);

		widgetcontainer.navclass = 'channel_' + id;

		Cloudwalkers.RootView.setView (widgetcontainer); 
	},

	'users' : function ()
	{
		var view = new Cloudwalkers.Views.Users ();
		Cloudwalkers.RootView.setView (view);
	},

	'write' : function ()
	{
		var view = new Cloudwalkers.Views.Write ();
		Cloudwalkers.RootView.setView (view);
	}

});