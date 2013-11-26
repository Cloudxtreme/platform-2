Cloudwalkers.Views.Dashboard = Cloudwalkers.Views.Widgets.WidgetContainer.extend({

	'title' : 'Dashboard',
	'widgetlist' : [
		{widget: "channelcounter", type: "inbox", size: 4, title: "Inbox", icon: "inbox", open: true, counter: true},
		{widget: "channelcounter", type: "monitoring", size: 4, title: "Keywords", icon: "tags", open: true, counter: true},
		{widget: "schedulecounter", type: "news", size: 4, title: "Schedule", icon: "time", open: true, counter: true},
		{widget: "coworkers", type: "drafts", size: 4, title: "Inbox Co-workers", color: "yellow", icon: "edit"},
		{widget: "trending", type: "profiles", size: 4, title: "Trending Company Posts", color : "grey", icon: "thumbs-up"},
		{widget: "trending", type: "news", size: 4, title: "Trending Social Feed", color: "red", icon: "thumbs-up"},
	],
	
	'initialize' : function ()
	{
		// Report widgets (dynamic)
		this.addDynamicReports();
		
		// Static widgets
		for(n in this.widgetlist) 
			switch(this.widgetlist[n].widget)
			{
				case 'trending':
					this.addDashboardTrending (this.widgetlist[n]);
					break;
					
				case 'channelcounter':
					this.addDashboardChannelCounter (this.widgetlist[n]);
					break;
					
				case 'schedulecounter':
					this.addDashboardScheduleCounter (this.widgetlist[n]);
					break;
					
				case 'report':
					this.addDashboardReport (this.widgetlist[n]);
					break;
					
				case 'drafts':
					this.addDashboardDrafts (this.widgetlist[n]);
					break;
					
				case 'coworkers':
					this.addInboxCoworkers (this.widgetlist[n]);
					break;
			}
	},
	
	'addDynamicReports' : function ()
	{
		var streams =  Cloudwalkers.Session.getStreams();
		var reportables = streams.where({statistics: 1});
		
		for(n in reportables)
			switch(reportables[n].get("network").token)
			{
				case "facebook":
					this.widgetlist.push({widget: "report", size: 3, stream: reportables[n], type: "numbercomparison/likes"});
					this.widgetlist.push({widget: "report", size: 3, stream: reportables[n], type: "besttimetoposttext/"});
					break;
					
				case "twitter":
					this.widgetlist.push({widget: "report", size: 3, stream: reportables[n], type: "numbercomparison/followers_count"});
					this.widgetlist.push({widget: "report", size: 3, stream: reportables[n], type: "besttimetoposttext/"});
					break;	
			}
	},

	'addDashboardTrending' : function (widgetdata)
	{

		/*var channel = Cloudwalkers.Session.getChannels().findWhere({type: widgetdata.type});
		widgetdata.streams = channel.streams;
		
		new Cloudwalkers.Views.Widgets.DashboardMessageList (widgetdata)*/
		
		var channel = Cloudwalkers.Session.getChannels().findWhere({type: widgetdata.type});
		
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
		var channel = channels.findWhere({type: widgetdata.type});
		
		$.extend(widgetdata, {name: channel.get('name'), open: 1, channel: channel});
		
		this.add(
			new Cloudwalkers.Views.Widgets.ChannelCounters (widgetdata),
			widgetdata.size
		);
	},

	'addDashboardScheduleCounter' : function (widgetdata)
	{
		this.add(
			new Cloudwalkers.Views.Widgets.ScheduleCounter(widgetdata),
			widgetdata.size
		);
	},
	
	'addDashboardReport' : function (widgetdata)
	{
		var report = new Cloudwalkers.Views.Widgets.Report({stream: widgetdata.stream, type: widgetdata.type});
		report.dashboard = true;
		
		this.add (report, widgetdata.size);
	},
	
	'addDashboardDrafts' : function (widgetdata)
	{
		var self = this;
		var data = widgetdata;
		
		data.open = 1;
		widgetdata.channel = new Cloudwalkers.Collections.Drafts ([], { 'name' : widgetdata.title, 'canLoadMore' : false });
		
		widget = new Cloudwalkers.Views.Widgets.DashboardMessageList (data)
		widget.messagetemplate = 'dashboardmessagedraft';
		
		self.add(widget, widgetdata.size);
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