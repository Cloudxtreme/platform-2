Cloudwalkers.Router = Backbone.Router.extend ({

	'routes' : {
		
		'write' : 'write',
		'share' : 'share',
		'schedule(/:channel)(/:stream)' : 'schedule',
		'drafts' : 'drafts',
		'inbox(/:channel)(/:type)(/:streamid)' : 'inbox',
		'coworkers' : 'coworkers',
		'channel/:channel(/:subchannel)(/:stream)(/:messageid)' : 'channel',
		'trending/:channel(/:subchannel)(/:stream)(/:messageid)' : 'trending',
		'monitoring/:channel(/:subchannel)(/:messageid)' : 'monitoring',
		'keywords' : 'managekeywords',
		'reports(/:streamid)' : 'reports',
		'settings(/:sub)' : 'settings',
		'dashboard/:accountid' : 'changeaccount',
		'home' : 'home',
		'*path' : 'dashboard'
	},

	'initialize' : function (){},
	
	/**
	 *	Dashboard
	 **/

	'dashboard' : function ()
	{	
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Dashboard());
	},
	
	/**
	 *	Account Switch
	 **/

	'changeaccount' : function (accountid)
	{	
		if(accountid != Cloudwalkers.Session.get("currentAccount"))
		{
			Cloudwalkers.Session.updateSetting("currentAccount", accountid, {success: this.home}); //patch: true
		}
	},
	
	/**
	 *	Message board
	 **/
	 
	'write' : function ()
	{
		var view = new Cloudwalkers.Views.Write ();
		Cloudwalkers.RootView.setView (view);
	},
	
	'share' : function ()
	{
		Cloudwalkers.RootView.viewshare ("general");
	},
	 
	'schedule' : function (channelid, streamid)
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
				'name' : 'Co-workers wall',
				'filter' : ''
			}
		);

		var widgetcontainer = new Cloudwalkers.Views.Widgets.WidgetContainer ();

		var widget = new Cloudwalkers.Views.Widgets.DraftList ({ 'channel' : collection, 'color' : 'blue' });
		widgetcontainer.addWidget (widget);

		widgetcontainer.title = 'Co-workers';
		widgetcontainer.navclass = 'inbox';

		Cloudwalkers.RootView.setView (widgetcontainer); 
	},
	
	
	/**
	 *	Inbox
	 **/
	 
	 'inbox' : function (id, type, streamid)
	{
		// Parameters
		var channel = Cloudwalkers.Session.getChannel (id? Number(id): 'inbox');
		
		if (!channel) return this.home();
		if (!type) type = "messages";
		if (!id) Cloudwalkers.Router.Instance.navigate("#inbox/" + channel.id + "/" + type);
		
		// Visualisation
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Inbox({channel: channel, type: type, streamid: streamid}));
	},
	 
	/*
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
	
	'inbox' : function (id, streamid, messageid)
	{

		// Parameters
		if(!id)
		{
			var channeldata = Cloudwalkers.Session.getChannel ('inbox');
			id = channeldata.id;
			Backbone.history.fragment += "/" + id; 
		}
		else
			var channeldata = Cloudwalkers.Session.getChannel (Number(id));
		
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
	},*/
	
	
	/**
	 *	Company Pages
	 *	Social Feeds
	 *	Trending
	 **/

	'channel' : function (id, subchannelid, streamid, messageid)
	{
		
		var channeldata = Cloudwalkers.Session.getChannel (Number(id));
		
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
		var channeldata = Cloudwalkers.Session.getChannel (Number(channelid));

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
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.KeywordMonitoring({category: Cloudwalkers.Session.getChannel(Number(catid))}));	
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
	 
	'settings' : function (endpoint)
	{
		
		var view = new Cloudwalkers.Views.Settings ({endpoint: endpoint});
		Cloudwalkers.RootView.setView (view);
	},

	'home' : function ()
	{
		Cloudwalkers.Session.reset();
		window.location = "/";
		
		return false;
	},
	
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