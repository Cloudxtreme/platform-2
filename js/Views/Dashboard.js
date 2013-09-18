Cloudwalkers.Views.Dashboard = Cloudwalkers.Views.Widgets.WidgetContainer.extend({

	'navclass' : 'dashboard',
	'title' : 'Dashboard',

	'initializeWidgets' : function ()
	{
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

		else if (widgetdata.widget == 'trending')
		{
			this.addDashboardTrending (widgetdata);
		}

		else if (widgetdata.widget == 'channelcounter')
		{
			this.addDashboardChannelCounter (widgetdata);	
		}

		else if (widgetdata.widget == 'schedulecounter')
		{
			this.addDashboardScheduleCounter (widgetdata);
		}

		else if (widgetdata.widget == 'report')
		{
			this.addReportWidget (widgetdata);
		}

		else if (widgetdata.widget == 'drafts')
		{
			collection = new Cloudwalkers.Collections.Drafts ([], { 'name' : widgetdata.title, 'canLoadMore' : false });

			var data = widgetdata;
			widgetdata.channel = collection;

			if (widgetdata.layout == 'dashboardmessagelist')
			{
				widget = new Cloudwalkers.Views.Widgets.DashboardMessageList (data)
				widget.messagetemplate = 'dashboardmessagedraft';
			}
			else
			{
				widget = new Cloudwalkers.Views.Widgets.DraftList (data);
				widget.template = 'messagecontainer';
			}

			// Size
			this.addWidgetWithSettings (widget, widgetdata);
		}

		else if (widgetdata.widget == 'scheduled')
		{
			var data = widgetdata;
			widgetdata.channel = collection;

			collection = new Cloudwalkers.Collections.Scheduled ([], { 'name' : widgetdata.title, 'canLoadMore' : false });
			widget = new Cloudwalkers.Views.Widgets.ScheduledList (data);

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
		this.add (widget, widgetdata.size);
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

				var data = widgetdata;
				widgetdata.channel = collection;

				// View
				if (widgetdata.layout == 'list')
				{
					widget = new Cloudwalkers.Views.Widgets.MessageList (data)
				}

				else if (widgetdata.layout == 'timeline')
				{
					widget = new Cloudwalkers.Views.Widgets.Timeline (data)
				}

				// Size
				this.addWidgetWithSettings (widget, widgetdata);
			}
		}
	},

	'addDashboardTrending' : function (widgetdata)
	{
		var widget;

		var account = Cloudwalkers.Session.getAccount ();
		var channels = account.channels ();
		var collection;

		for (var i = 0; i < channels.length; i ++)
		{
			if (channels[i].type == widgetdata.type)
			{
				var since = (Date.today().add({ days: -7 }));

				if (channels[i].type == 'news')
				{
					since = (Date.today().add({ days: -1 }));
				}

				collection = new Cloudwalkers.Collections.Trending 
				(
					[], 
					{ 
						'id' : channels[i].id, 
						'name' : widgetdata.title,
						'amount' : widgetdata.messages,
						'canLoadMore' : false,
						'showMoreButton' : widgetdata.layout == 'timeline' ? '#trending/' + channels[i].id : false,
						'since' : since
					}
				);

				var data = widgetdata;
				widgetdata.channel = collection;

				// View
				if (widgetdata.layout == 'list')
				{
					widget = new Cloudwalkers.Views.Widgets.MessageList (data)
				}

				else if (widgetdata.layout == 'timeline')
				{
					widget = new Cloudwalkers.Views.Widgets.Timeline (data)
					widget.messagetemplate = 'messagetimelinetrending';
				}

				else if (widgetdata.layout == 'dashboardmessagelist')
				{
					widget = new Cloudwalkers.Views.Widgets.DashboardMessageList (data)
					widget.messagetemplate = 'dashboardmessagetrending';
				}

				// Size
				this.addWidgetWithSettings (widget, widgetdata);
			}
		}
	},

	'addDashboardChannelCounter' : function (widgetdata)
	{
		function createView (channel)
		{
			Cloudwalkers.Storage.get ('collapse_channel_' + channel.id, function (open)
			{
				open = open == 1;

				widget = new Cloudwalkers.Views.Widgets.ChannelCounters ({ 'channel' : channel, 'color' : widgetdata.color, 'title' : channel.name, 'icon' : widgetdata.icon, 'network' : widgetdata.network, 'open' : open })

				// Size
				self.addWidgetWithSettings (widget, widgetdata);

				// Toggle
				widget.on ('view:expand', function ()
				{
					Cloudwalkers.Storage.set ('collapse_channel_' + channel.id, 1);
				});

				widget.on ('view:collapse', function ()
				{
					Cloudwalkers.Storage.set ('collapse_channel_' + channel.id, 0);
				});

			}, false);
		}

		var widget;

		var account = Cloudwalkers.Session.getAccount ();
		var channels = account.channels ();
		var collection;
		var self = this;

		for (var i = 0; i < channels.length; i ++)
		{
			if (channels[i].type == widgetdata.type)
			{
				createView (channels[i])
			}
		}
	},

	'addDashboardScheduleCounter' : function (widgetdata)
	{
		var widget;
		var self = this;

		var schedule = new Cloudwalkers.Collections.Scheduled ([], { 'title' : 'Schedule' });

		var data = widgetdata;
		widgetdata.schedule = schedule;

		Cloudwalkers.Storage.get ('collapse_schedule', function (open)
		{
			data.open = open == 1;

			widget = new Cloudwalkers.Views.Widgets.ScheduleCounter (data)

			// Toggle
			widget.on ('view:expand', function ()
			{
				Cloudwalkers.Storage.set ('collapse_schedule', 1);
			});

			widget.on ('view:collapse', function ()
			{
				Cloudwalkers.Storage.set ('collapse_schedule', 0);
			});

			self.addWidgetWithSettings (widget, widgetdata);
		}, false);
	},

	'addReportWidget' : function (reportdata)
	{
		var self = this;

		//var dataurl = CONFIG_BASE_URL + 'json/' + statdata.url;

		var report = new Cloudwalkers.Models.Report (reportdata.report);

		var widget = report.getWidget ();
		widget.color = reportdata.network.icon + '-color';
		widget.network = reportdata.network;

		this.addWidgetWithSettings (widget, reportdata);
	}
});