Cloudwalkers.Router = Backbone.Router.extend ({

	'routes' : {
		
		'new/keywordsmanager' : 'keywordsmanager',
	
		'channel/:channel(/:subchannel)(/:stream)(/:messageid)' : 'channel',
		'keywords/:channel(/:subchannel)(/:stream)(/:messageid)' : 'keywords',
		'keywords' : 'managekeywords',
		'schedule(/:stream)' : 'schedule',
		'drafts' : 'drafts',
		'settings(/:sub)' : 'settings',
		'write' : 'write',
		'reports(/:streamid)' : 'reports',
		'trending/:channel(/:subchannel)(/:stream)(/:messageid)' : 'trending',
		'inbox' : 'inbox',
		'coworkers' : 'coworkers',
		'*path' : 'dashboard'
	},

	'initialize' : function ()
	{
		//console.log ('init');
	},

	'dashboard' : function ()
	{	
		Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Dashboard());	
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
			//console.log (widgetcontainer.subnavclass);
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

	'channel' : function (id, subchannelid, streamid, messageid)
	{
		var channeldata = Cloudwalkers.Session.getChannelFromId (id);

		if (!channeldata)
		{
			Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Error ({'error' : 'Root channel not found: ' + id})); 
			return;
		}

        var channel;

		if (subchannelid > 0)
		{
            channeldata = Cloudwalkers.Session.getChannelFromId (subchannelid);

			channel = new Cloudwalkers.Collections.Channel
			(
				[], 
				{ 
					'id' : subchannelid, 
					'name' : channeldata.name
				}
			);
		}
		else
		{
			channel = new Cloudwalkers.Collections.Channel
			(
				[], 
				{ 
					'id' : id, 
					'name' : channeldata.name
				}
			);
		}

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

		//console.log (channeldata);

        var listwidget;

		if (channeldata.type == 'monitoring')
		{
			var keywordfilter = new Cloudwalkers.Views.Widgets.ChannelFilters ({ 'channel' : channel });
			widgetcontainer.add (keywordfilter, 12);

			keywordfilter.on ('stream:change', function (stream)
			{
				var filters = {};

				if (stream)
				{
					filters['streams'] = [ stream ];
				}
				
				channel.setFilters (filters);
			});

			listwidget = new Cloudwalkers.Views.Widgets.DetailedList ({ 'channel' : channel, 'color' : 'blue', 'selectmessage' : messageid });
			widgetcontainer.add (listwidget, 4);

			widget = new Cloudwalkers.Views.Widgets.DetailedView ({ 'list' : listwidget });
			widgetcontainer.add (widget, 8);
		}

		else if (channeldata.type == 'inbox')
		{
			widgetcontainer.templatename = "inboxcontainer"; 
			
			listwidget = new Cloudwalkers.Views.Widgets.InboxList ({ 'channel' : channel, 'color' : 'blue', 'selectmessage' : messageid });
			widgetcontainer.addWidgetSize (listwidget, false, 4);
			
			//widget = new Cloudwalkers.Views.Widgets.DetailedView ({ 'list' : listwidget });
			widget = new Cloudwalkers.Views.Widgets.InboxMessage({ 'list' : listwidget });
			widgetcontainer.addWidgetSize (widget, false, 8);
		}
		else
		{
			widget = new Cloudwalkers.Views.Widgets.Timeline({ 'channel': channel, 'color': 'blue', 'selectmessage': messageid });
			widgetcontainer.addWidget (widget);
		}

		widgetcontainer.navclass = 'channel_' + id;

		if (subchannelid)
		{
			widgetcontainer.subnavclass = 'channel_' + id + '_' + subchannelid;
		}

		else if (streamid)
		{
			widgetcontainer.subnavclass = 'channel_' + id + '_' + streamid;
			//console.log (widgetcontainer.subnavclass);
		}

		Cloudwalkers.RootView.setView (widgetcontainer); 
	},
	
	'keywords' : function (id, subchannelid, streamid, messageid)
	{
		var channeldata = Cloudwalkers.Session.getChannelFromId (id);

		if (!channeldata)
		{
			Cloudwalkers.RootView.setView (new Cloudwalkers.Views.Error ({'error' : 'Root channel not found: ' + id})); 
			return;
		}

        var channel;
        
        console.log(subchannelid)

		if (subchannelid > 0)
		{
			channel = new Cloudwalkers.Collections.Channel
			(
				[], 
				{ 
					'id' : subchannelid, 
					'name' : channeldata.name
				}
			);
		}
		else
		{
			channel = new Cloudwalkers.Collections.Channel
			(
				[], 
				{ 
					'id' : id, 
					'name' : channeldata.name
				}
			);
		}

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

		//console.log (channeldata);

        var listwidget;

		if (channeldata.type == 'monitoring')
		{
			var keywordfilter = new Cloudwalkers.Views.Widgets.ChannelFilters ({ 'channel' : channel });
			widgetcontainer.add (keywordfilter, 12);

			keywordfilter.on ('stream:change', function (stream)
			{
				var filters = {};

				if (stream)
				{
					filters['streams'] = [ stream ];
				}
				
				channel.setFilters (filters);
			});

			listwidget = new Cloudwalkers.Views.Widgets.DetailedList ({ 'channel' : channel, 'color' : 'blue', 'selectmessage' : messageid });
			widgetcontainer.add (listwidget, 4);

			widget = new Cloudwalkers.Views.Widgets.DetailedView ({ 'list' : listwidget });
			widgetcontainer.add (widget, 8);
		}

		else if (channeldata.type == 'inbox')
		{
			widgetcontainer.templatename = "inboxcontainer"; 
			
			listwidget = new Cloudwalkers.Views.Widgets.DetailedList ({ 'channel' : channel, 'color' : 'blue', 'selectmessage' : messageid });
			widgetcontainer.addWidgetSize (listwidget, false, 4);

			widget = new Cloudwalkers.Views.Widgets.DetailedView ({ 'list' : listwidget });
			widgetcontainer.addWidgetSize (widget, false, 8);
		}
		else
		{
			widget = new Cloudwalkers.Views.Widgets.Timeline({ 'channel': channel, 'color': 'blue', 'selectmessage': messageid });
			widgetcontainer.addWidget (widget);
		}

		widgetcontainer.navclass = 'channel_' + id;

		if (subchannelid)
		{
			widgetcontainer.subnavclass = 'channel_' + id + '_' + subchannelid;
		}

		else if (streamid)
		{
			widgetcontainer.subnavclass = 'channel_' + id + '_' + streamid;
			//console.log (widgetcontainer.subnavclass);
		}

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

		//widgetcontainer.navclass = 'trending';
		widgetcontainer.navclass = 'channel_' + channelid;

		widgetcontainer.subnavclass = 'trending_' + channelid;
		if (streamid)
		{
			widgetcontainer.subsubnavclass = 'trending_' + channelid + '_' + streamid;
		}

		Cloudwalkers.RootView.setView (widgetcontainer); 
	},

	/*'users' : function ()
	{
		var view = new Cloudwalkers.Views.Users ();
		Cloudwalkers.RootView.setView (view);
	},*/
	
	'settings' : function (action)
	{
		//console.log (action);

		var view = new Cloudwalkers.Views.Settings.Container ();
		view.setAction (action);
		Cloudwalkers.RootView.setView (view);
	},

	'write' : function ()
	{
		var view = new Cloudwalkers.Views.Write ();
		Cloudwalkers.RootView.setView (view);
	},

	'reports' : function (streamid)
	{
		var view = new Cloudwalkers.Views.Reports ({ 'stream' : Cloudwalkers.Session.getStream (streamid) });

		if (streamid)
		{
			view.subnavclass = 'reports_' + streamid;
		}

		Cloudwalkers.RootView.setView (view);
	},

	'managekeywords' : function ()
	{
		var view = new Cloudwalkers.Views.ManageKeywords ();
		Cloudwalkers.RootView.setView (view);
	},

	'inbox' : function ()
	{
		var channel = Cloudwalkers.Session.getAccount ().getChannelFromType ('inbox');
		if (channel)
		{
			document.location = '#channel/' + channel.id;
		}
	},

	'services': function ()
	{
		var view = new Cloudwalkers.Views.Services ();
		Cloudwalkers.RootView.setView (view);
	},
	
	/*
	 *		NEW
	 *		v0.8.0 - nightwalker spretzel
	 */
	
	'keywordsmanager' : function ()
	{
		var view = new Cloudwalkers.Views.ManageKeywords ();
		Cloudwalkers.RootView.setView (view);
	}

});