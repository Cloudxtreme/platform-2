Cloudwalkers.Views.Dashboard = Cloudwalkers.Views.Widgets.WidgetContainer.extend({

	'title' : 'Dashboard',
	'widgets' : {},
	

	'initializeWidgets' : function ()
	{
		var collection;
		var widget;

		// All channels
		var account = Cloudwalkers.Session.getAccount();

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
		
		if (widgetdata.widget == 'trending')
			this.addDashboardTrending (widgetdata);

		else if (widgetdata.widget == 'channelcounter')
			this.addDashboardChannelCounter (widgetdata);	

		else if (widgetdata.widget == 'schedulecounter')
			this.addDashboardScheduleCounter (widgetdata);

		else if (widgetdata.widget == 'report')
		{
			var report = new Cloudwalkers.Models.Report (widgetdata.report);

			var widget = report.getWidget ();
			widget.color = widgetdata.network.icon + '-color';
			widget.network = widgetdata.network;
			widget.dashboard = true;
	
			this.add (widget, widgetdata.size);
		}
		else if (widgetdata.widget == 'drafts')
		{
			var self = this;

			collection = new Cloudwalkers.Collections.Drafts ([], { 'name' : widgetdata.title, 'canLoadMore' : false });

			var data = widgetdata;
			data.open = 1;
			widgetdata.channel = collection;
			
			widget = new Cloudwalkers.Views.Widgets.DashboardMessageList (data)
			widget.messagetemplate = 'dashboardmessagedraft';
			
			self.add(widget, widgetdata.size);

		}
        else if (widgetdata.widget == 'coworkers')
			this.addInboxCoworkers (widgetdata);

	},

	'addDashboardTrending' : function (widgetdata)
	{

		var channels = Cloudwalkers.Session.getAccount().channels;
		var channel = channels.where({type: widgetdata.type}).pop();
		
        var since = (Date.today().add(
        	{ days: (widgetdata.type == 'news')? -1: -7 }
        ));

		widgetdata.open = 1;
		widgetdata.channel = new Cloudwalkers.Collections.Trending ( [], { 
			'id' : channel.id, 
			'name' : widgetdata.title,
			'amount' : widgetdata.messages,
			'canLoadMore' : false,
            'since' : since
		});
		
		var widget = new Cloudwalkers.Views.Widgets.DashboardMessageList (widgetdata)
		widget.messagetemplate = 'dashboardmessagetrending';
		
		this.add (widget, widgetdata.size);
		
	},
	
	'addDashboardChannelCounter' : function (widgetdata)
	{
		var channels = Cloudwalkers.Session.getAccount().channels;
		var channel = channels.where({type: widgetdata.type}).pop();
		
		$.extend(widgetdata, {name: channel.get('name'), open: 1, channel: channel});
		
		this.add(
			new Cloudwalkers.Views.Widgets.ChannelCounters (widgetdata),
			widgetdata.size
		);
	},

	'addDashboardScheduleCounter' : function (widgetdata)
	{
		var widget;
		var self = this;
		var schedule = new Cloudwalkers.Collections.Scheduled ([], { 'title' : 'Schedule' });
		var data = widgetdata;
		
		data.open = 1;
		widgetdata.schedule = schedule;
		
		self.add(
			new Cloudwalkers.Views.Widgets.ScheduleCounter(data),
			widgetdata.size
		);
	},
	
	'addInboxCoworkers' : function (widgetdata)
	{
		var self = this;

        collection = new Cloudwalkers.Collections.Drafts ([], { 'name' : widgetdata.title, 'canLoadMore' : false, 'filter' : 'others' });

        var data = widgetdata;
        data.open = 1;
        widgetdata.channel = collection;

        widget = new Cloudwalkers.Views.Widgets.DashboardMessageList (data)
        widget.messagetemplate = 'dashboardmessagedraft';

        self.add(widget, widgetdata.size);
	},
});