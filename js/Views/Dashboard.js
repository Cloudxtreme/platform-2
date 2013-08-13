Cloudwalkers.Views.Dashboard = Cloudwalkers.Views.Widgets.WidgetContainer.extend({

	'navclass' : 'dashboard',
	'title' : 'Dashboard',

	'newline' : false,

	'initializeWidgets' : function ()
	{
		this.newline = true;

		var collection;
		var widget;

		// All channels
		var account = Cloudwalkers.Session.getAccount ();

		var self = this;

		$.ajax 
		(
			CONFIG_BASE_URL + 'json/account/' + account.id + '/dashboard',
			{
				'success' : function (result)
				{
					for (var i = 0; i < result.widgets.length; i ++)
					{
						self.addDashboardWidget (result.widgets[i]);
					}
				}
			}
		);
	},

	'addDashboardWidget' : function (widgetdata)
	{
		//console.log (widget);
		var widget;

		if (widgetdata.widget == 'title')
		{
			widget = new Cloudwalkers.Views.Widgets.Title (widgetdata);
			this.addWidget (widget, true);
		}

		else if (widgetdata.widget == 'channel')
		{
			this.addDashboardChannel (widgetdata);
		}

		else if (widgetdata.widget == 'drafts')
		{
			collection = new Cloudwalkers.Collections.Drafts ([], { 'name' : widgetdata.title, 'canLoadMore' : false });
			widget = new Cloudwalkers.Views.Widgets.DraftList ({ 'channel' : collection, 'color' : widgetdata.color });

			// Size
			this.addWidgetWithSettings (widget, widgetdata);
		}

		else if (widgetdata.widget == 'scheduled')
		{
			collection = new Cloudwalkers.Collections.Scheduled ([], { 'name' : widgetdata.title, 'canLoadMore' : false });
			widget = new Cloudwalkers.Views.Widgets.ScheduledList ({ 'channel' : collection, 'color' : widgetdata.color });

			this.addWidgetWithSettings (widget, widgetdata);
		}

		else if (widgetdata.widget == 'numberstat')
		{
			widgetdata.dataurl = CONFIG_BASE_URL + 'json' + widgetdata.url;

			widget = new Cloudwalkers.Views.Widgets.Charts.Numberstat (widgetdata);
			this.addWidgetWithSettings (widget, widgetdata);
		}

		else if (widgetdata.widget == 'linechart')
		{
			widgetdata.dataurl = CONFIG_BASE_URL + 'json' + widgetdata.url;

			widget = new Cloudwalkers.Views.Widgets.Charts.Linechart (widgetdata);
			this.addWidgetWithSettings (widget, widgetdata);
		}

		// All types
		/*
		collection = new Cloudwalkers.Collections.TypedMessages ([], { 'id' : 'social', 'name' : 'Social media' });
		widget = new Cloudwalkers.Views.Widgets.MessageList ({ 'channel' : collection, 'color' : 'blue' });

		this.addHalfWidget (widget);
		*/

		/*

		// All types
		collection = new Cloudwalkers.Collections.Drafts ([], { 'name' : 'Inbox Co-Workers', 'canLoadMore' : false });
		widget = new Cloudwalkers.Views.Widgets.DraftList ({ 'channel' : collection, 'color' : 'yellow' });

		this.addHalfWidget (widget);

		// Useless stat bars
		widget = new Cloudwalkers.Views.Widgets.HTMLWidget ({ 'html' : Mustache.render (Templates.stat1, {}) });
		this.addHalfWidget (widget, true);

		widget = new Cloudwalkers.Views.Widgets.HTMLWidget ({ 'html' : Mustache.render (Templates.stat2, {}) });
		this.addHalfWidget (widget, false);
		// End Useless stat bars


		// All types
		collection = new Cloudwalkers.Collections.Scheduled ([], { 'name' : 'Scheduled messages', 'canLoadMore' : false });
		widget = new Cloudwalkers.Views.Widgets.ScheduledList ({ 'channel' : collection, 'color' : 'red' });

		this.addHalfWidget (widget);

		// News and profiles
		for (var i = 0; i < channels.length; i ++)
		{
			if (channels[i].type == 'news' || channels[i].type == 'profiles')
			{
				collection = new Cloudwalkers.Collections.Channel 
				(
					[], 
					{ 
						'id' : channels[i].id, 
						'name' : channels[i].name,
						'amount' : 3,
						'showMoreButton' : '#channel/' + channels[i].id,
						'canLoadMore' : false
					}
				);

				widget = new Cloudwalkers.Views.Widgets.Timeline ({ 'channel' : collection, 'color' : 'red' })
				this.addWidget (widget, true);
			}
		}

		// STUPID STAT BLOCKS
		widget = new Cloudwalkers.Views.Widgets.HTMLWidget ({ 'html' : Mustache.render (Templates.stat3, {}) });
		this.addHalfWidget (widget, true);

		widget = new Cloudwalkers.Views.Widgets.HTMLWidget ({ 'html' : Mustache.render (Templates.stat4, {}) });
		this.addHalfWidget (widget, false);
		*/
	},

	'addWidgetWithSettings' : function (widget, widgetdata)
	{
		// Size
		if (widgetdata.size == 'half')
		{
			this.addHalfWidget (widget, this.newline);
			this.newline = !this.newline;
		}
		else if (widgetdata.size == 'full')
		{
			this.addWidget (widget, true);
			this.newline = true;
		}
	},

	'addDashboardChannel' : function (widgetdata)
	{
		var widget;

		var account = Cloudwalkers.Session.getAccount ();
		var channels = account.channels ();
		var collection;

		for (var i = 0; i < channels.length; i ++)
		{
			if (channels[i].type == widgetdata.type)
			{
				collection = new Cloudwalkers.Collections.Channel 
				(
					[], 
					{ 
						'id' : channels[i].id, 
						'name' : channels[i].name,
						'amount' : widgetdata.messages,
						'canLoadMore' : false,
						'showMoreButton' : widgetdata.layout == 'timeline' ? '#channel/' + channels[i].id : false
					}
				);

				// View
				if (widgetdata.layout == 'list')
				{
					widget = new Cloudwalkers.Views.Widgets.MessageList ({ 'channel' : collection, 'color' : widgetdata.color, 'title' : widgetdata.title })
				}

				else if (widgetdata.layout == 'timeline')
				{
					widget = new Cloudwalkers.Views.Widgets.Timeline ({ 'channel' : collection, 'color' : 'red' })
				}

				// Size
				this.addWidgetWithSettings (widget, widgetdata);
			}
		}
	}
});