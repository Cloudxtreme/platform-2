Cloudwalkers.Views.Dashboard = Cloudwalkers.Views.Widgets.WidgetContainer.extend({

	'navclass' : 'dashboard',
	'title' : 'Dashboard',

	'newline' : false,

	/*'initialize' : function ()
	{
		
		this.templateData = {foo:'bar'};
		
	},*/
	
	'render' : function ()
	{
		
		this.templateData = {foo:'bar'};
		/*this.$el.html('loading...');
		
		$.get(CONFIG_BASE_URL +'/assets/templates/dashboard.jsml', _.bind(function(template)
		{ 
			this.$el.html(Mustache.render(template, this.templateData));	
		}, this));*/
		
		this.$el.load(CONFIG_BASE_URL +'/assets/templates/dashboard.html');//, function(template){ this.$el.html(Mustache.render(template, this.templateData )) }, function(){ console.log('error'); });

		return this;
	},
	
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

		else
		{
			this.addWidgetSize (widget, false, widgetdata.size);
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
					widget = new Cloudwalkers.Views.Widgets.MessageList ({ 'channel' : collection, 'color' : widgetdata.color, 'title' : widgetdata.title, 'icon' : widgetdata.icon })
				}

				else if (widgetdata.layout == 'timeline')
				{
					widget = new Cloudwalkers.Views.Widgets.Timeline ({ 'channel' : collection, 'color' : 'red', 'icon' : widgetdata.icon })
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

				// View
				if (widgetdata.layout == 'list')
				{
					widget = new Cloudwalkers.Views.Widgets.MessageList ({ 'channel' : collection, 'color' : widgetdata.color, 'title' : widgetdata.title, 'icon' : widgetdata.icon })
				}

				else if (widgetdata.layout == 'timeline')
				{
					widget = new Cloudwalkers.Views.Widgets.Timeline ({ 'channel' : collection, 'color' : 'red', 'icon' : widgetdata.icon })
					widget.messagetemplate = 'messagetimelinetrending';
				}

				// Size
				this.addWidgetWithSettings (widget, widgetdata);
			}
		}
	},

	'addDashboardChannelCounter' : function (widgetdata)
	{
		var widget;

		var account = Cloudwalkers.Session.getAccount ();
		var channels = account.channels ();
		var collection;

		for (var i = 0; i < channels.length; i ++)
		{
			if (channels[i].type == widgetdata.type)
			{
				widget = new Cloudwalkers.Views.Widgets.ChannelCounters ({ 'channel' : channels[i], 'color' : widgetdata.color, 'title' : channels[i].name, 'icon' : widgetdata.icon })

				// Size
				this.addWidgetWithSettings (widget, widgetdata);
			}
		}
	},

	'addDashboardScheduleCounter' : function (widgetdata)
	{
		var widget;

		var schedule = new Cloudwalkers.Collections.Scheduled ([], { 'title' : 'Schedule' });

		widget = new Cloudwalkers.Views.Widgets.ScheduleCounter ({ 'schedule' : schedule, 'color' : widgetdata.color, 'title' : 'Schedule', 'icon' : widgetdata.icon })
		this.addWidgetWithSettings (widget, widgetdata);
	},

	'addReportWidget' : function (reportdata)
	{
		var self = this;

		//var dataurl = CONFIG_BASE_URL + 'json/' + statdata.url;

		var report = new Cloudwalkers.Models.Report (reportdata.report);

		var widget = report.getWidget ();
		widget.color = reportdata.network + '-color';

		this.addWidgetWithSettings (widget, reportdata);
	}
});