Cloudwalkers.Router = Backbone.Router.extend ({

	'routes' : {
		
		'write' : 'write',
		'schedule(/:stream)' : 'schedule',
		'drafts' : 'drafts',
		'inbox(/:channel)(/:stream)(/:messageid)' : 'inbox',
		'coworkers' : 'coworkers',
		'channel/:channel(/:subchannel)(/:stream)(/:messageid)' : 'channel',
		'trending/:channel(/:subchannel)(/:stream)(/:messageid)' : 'trending',
		'monitoring/:channel(/:subchannel)(/:messageid)' : 'monitoring',
		'keywords' : 'managekeywords',
		'reports(/:streamid)' : 'reports',
		'settings(/:sub)' : 'settings',
		'*path' : 'dashboard'
	},

	'initialize' : function (){},
	
	'channel_' : function (channeldata, subid, streamid)
	{
		
		var channel = new Cloudwalkers.Collections.Channel (
			[],
			{'id' : (subid)? subid: channeldata.id, 'name' : channeldata.name | "" }
		);
		
		if (streamid)
		{
			var filters = { streams: [ streamid ] };
			channel.setFilters (filters);	
		}
		
		return channel;
	},
	
	
	/**
	 *	Dashboard
	 **/

	'dashboard' : function ()
	{	
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Dashboard());	
	},
	

	/**
	 *	Message board
	 **/
	 
	'write' : function ()
	{
		var view = new Cloudwalkers.Views.Write ();
		Cloudwalkers.RootView.setView (view);
	},
	 
	'schedule' : function (streamid)
	{
		var parameters = 			
		{ 
			'name' : 'Scheduled messages'
		};

		var filters = {};

		if (typeof (streamid) != 'undefined' && streamid)
		{
			filters.streams = [ streamid ];
		}

		var channel = new Cloudwalkers.Collections.Scheduled ([], parameters);
		channel.setFilters (filters);

		var widgetcontainer = new Cloudwalkers.Views.Widgets.WidgetContainer ();

		var widget = new Cloudwalkers.Views.Widgets.ScheduledTable ({ 'channel' : channel, 'color' : 'blue' });
		widgetcontainer.addWidget (widget);

		widgetcontainer.navclass = 'schedule';
		widgetcontainer.title = 'Schedule';

		if (streamid)
		{
			widgetcontainer.subnavclass = 'schedule_' + streamid;
		}

		Cloudwalkers.RootView.setView (widgetcontainer); 
	},

	'drafts' : function ()
	{
		var collection = new Cloudwalkers.Collections.Drafts
		(
			[], 
			{ 
				'name' : 'Draft messages',
				'filter' : 'mine'
			}
		);

		var widgetcontainer = new Cloudwalkers.Views.Widgets.WidgetContainer ();

		var widget = new Cloudwalkers.Views.Widgets.DraftList ({ 'channel' : collection, 'color' : 'blue' });
		widgetcontainer.addWidget (widget);

		widgetcontainer.title = 'Drafts';
		widgetcontainer.navclass = 'drafts';

		Cloudwalkers.RootView.setView (widgetcontainer); 
	},

	'coworkers' : function ()
	{
		var collection = new Cloudwalkers.Collections.Drafts
		(
			[], 
			{ 
				'name' : 'Draft messages',
				'filter' : 'others'
			}
		);

		var widgetcontainer = new Cloudwalkers.Views.Widgets.WidgetContainer ();

		var widget = new Cloudwalkers.Views.Widgets.DraftList ({ 'channel' : collection, 'color' : 'blue' });
		widgetcontainer.addWidget (widget);

		widgetcontainer.title = 'Coworkers';
		widgetcontainer.navclass = 'inbox';

		Cloudwalkers.RootView.setView (widgetcontainer); 
	},
	
	
	/**
	 *	Inbox
	 **/
	 
	'inbox' : function (id, streamid, messageid)
	{

		// Parameters
		if(!id)
		{
			var channeldata = Cloudwalkers.Session.getAccount ().getChannelFromType ('inbox');
			id = channeldata.id;
			Backbone.history.fragment += "/" + id; 
		}
		else
			var channeldata = Cloudwalkers.Session.getChannelFromId (id);
		
		if (!channeldata) return this.home();
		
		var channel = this.channel_(channeldata, null, streamid);


		// Visualisation
		var widgetcontainer = new Cloudwalkers.Views.Widgets.WidgetContainer ();
		widgetcontainer.title = channeldata.name;
		widgetcontainer.templatename = "inboxcontainer"; 
			
		var listwidget = new Cloudwalkers.Views.Widgets.InboxList ({ 'channel' : channel, 'color' : 'blue', 'selectmessage' : messageid });
		widgetcontainer.addWidgetSize (listwidget, false, 4);

		var widget = new Cloudwalkers.Views.Widgets.InboxMessage({ 'list' : listwidget });
		widgetcontainer.addWidgetSize (widget, false, 8);
		
		Cloudwalkers.RootView.setView (widgetcontainer); 
	},
	
	
	/**
	 *	Company Pages
	 *	Social Feeds
	 *	Trending
	 **/

	'channel' : function (id, subchannelid, streamid, messageid)
	{
		
		var channeldata = Cloudwalkers.Session.getChannelFromId (id);
		
		if (!channeldata) return this.home();

        var channel = new Cloudwalkers.Collections.Channel ( [], { 'id' : id, 'name' : channeldata.name });

		var filters = {};
		if (typeof (streamid) != 'undefined')
		{
			filters['streams'] = [ streamid ];
			channel.setFilters (filters);	
		}

		var widgetcontainer = new Cloudwalkers.Views.Widgets.WidgetContainer ();
		widgetcontainer.title = channeldata.name;

		var widget;
        var listwidget;

		widget = new Cloudwalkers.Views.Widgets.Timeline({ 'channel': channel, 'color': 'blue', 'selectmessage': messageid });
		widgetcontainer.addWidget (widget);

		Cloudwalkers.RootView.setView (widgetcontainer); 
	},

	'trending' : function (channelid, streamid)
	{
		var channeldata = Cloudwalkers.Session.getChannelFromId (channelid);

		var since = (Date.today().add({ days: -7 }));
		if (channeldata.type == 'news')
		{
			since = (Date.today().add({ days: -1 }));
		}

		var channel = new Cloudwalkers.Collections.Trending 
		(
			[], 
			{ 
				'id' : channelid, 
				'name' : 'Trending ' + channeldata.name,
				'since' : since
			}
		);

		var filters = {};
		if (typeof (streamid) != 'undefined')
		{
			filters['streams'] = [ streamid ];
			channel.setFilters (filters);	
		}

		var widgetcontainer = new Cloudwalkers.Views.Widgets.WidgetContainer ();
		widgetcontainer.title = channeldata.name;

		// Check the types
		var widget;

		widget = new Cloudwalkers.Views.Widgets.Timeline({ 'channel': channel, 'color': 'blue' });
		widget.messagetemplate = 'messagetimelinetrending';

		widgetcontainer.addWidget (widget);

		Cloudwalkers.RootView.setView (widgetcontainer); 
	},
	

	/**
	 *	Monitoring
	 **/
	'monitoring' : function (id, catid, messageid)
	{
		// Parameters
		var channel = Cloudwalkers.Session.getChannelFromId (id);
		var category = channel.get("channels").filter(function(cat){ return cat.id == catid }).pop();//Cloudwalkers.Session.getChannelFromId (catid);
		
		if (!channel || !category) return this.home();
		
		// Visualisation
		var widgetcontainer = new Cloudwalkers.Views.Widgets.WidgetContainer ({name: channel.get("name")});
		widgetcontainer.templatename = "keywordcontainer"; 
		
		var keywordfilter = new Cloudwalkers.Views.Widgets.ChannelFilters ({ 'category' : category }); //ChannelFilters ({ 'channel' : channel, 'name' : channeldata.name });
		widgetcontainer.add (keywordfilter, 4);
		
		var listwidget = new Cloudwalkers.Views.Widgets.MonitorList ({ 'category' : category, 'streams': keywordfilter.streams, 'keywords': keywordfilter.keywords });
		widgetcontainer.add (listwidget, 8);
		
		Cloudwalkers.RootView.setView (widgetcontainer);

	},
	
	'managekeywords' : function ()
	{
		var view = new Cloudwalkers.Views.ManageKeywords ();
		Cloudwalkers.RootView.setView (view);
	},
	
	
	/**
	 *	Reports
	 **/

	'reports' : function (streamid)
	{
		var view = new Cloudwalkers.Views.Reports ({ 'stream' : Cloudwalkers.Session.getStream (streamid) });

		if (streamid)
		{
			view.subnavclass = 'reports_' + streamid;
		}

		Cloudwalkers.RootView.setView (view);
	},

	
	/**
	 *	Settings
	 **/
	 
	'settings' : function (action)
	{
		var view = new Cloudwalkers.Views.Settings.Container ();
		view.setAction (action);
		Cloudwalkers.RootView.setView (view);
	},

	'home' : function () { window.location = "/"; },
	
	'exception' : function (errno)
	{ 
		var red = "/";
		
		switch(errno)
		{
			case 401 : red = "/401.html";
			case 503 : red = "/503.html";

			default : window.location = red;
		}
	}

});