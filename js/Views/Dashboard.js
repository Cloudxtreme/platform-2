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
			widget.template = 'messagecontainer';

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
			var datasource = new Cloudwalkers.Models.StatisticDataset ({ 'dataurl' : CONFIG_BASE_URL + 'json' + widgetdata.url });

			widgetdata.dataset = datasource;

			widget = new Cloudwalkers.Views.Widgets.Charts.Numberstat (widgetdata);
			this.addWidgetWithSettings (widget, widgetdata);
		}

		else if (widgetdata.widget == 'linechart')
		{
			var datasource = new Cloudwalkers.Models.StatisticDataset ({ 'dataurl' : CONFIG_BASE_URL + 'json' + widgetdata.url });

			widgetdata.dataset = datasource;

			widget = new Cloudwalkers.Views.Widgets.Charts.Linechart (widgetdata);
			this.addWidgetWithSettings (widget, widgetdata);
		}
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