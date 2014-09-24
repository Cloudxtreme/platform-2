Cloudwalkers.Views.Dashboard = Cloudwalkers.Views.Pageview.extend({

	'title' : "Dashboard",
	
	'widgets' : [
		//{widget: "messagescounters", type: "inbox", source: "streams", size: 4, title: "Inbox", icon: "inbox", open: true, counter: true, typelink: "#inbox", countString: "incomingUnread", scrollable: 'scrollable', translation: {'title': 'inbox'}},
		//{widget: "messagescounters", type: "monitoring", source: "channels", size: 4, title: "Keywords", icon: "tags", open: true, counter: true, countString: "incoming", scrollable: 'scrollable', translation: { 'title': 'keywords'}},
		{widget: "schedulecounter", type: "schedule", source: "streams", size: 4, title: "Schedule", icon: "time", open: true, counter: true, countString: "scheduled", link: "#scheduled", scrollable: 'scrollable', translation:{ 'title': 'schedule'}},
		//{widget: "coworkers", type: "drafts", size: 4, title: "Co-workers wall", color: "yellow", icon: "edit", open: true, link: "#coworkers", scrollable: 'scrollable', translation: { 'title': 'co-workers_wall'}},
		//{widget: "trending", type: "profiles", size: 4, title: "Trending Company Posts", color : "grey", icon: "thumbs-up", open: true, since: 7, sublink: "#trending/", scrollable: 'scrollable', translation:{ 'title': 'trending_company_posts'}},
		//{widget: "trending", type: "news", size: 4, title: "Trending Accounts we follow", color: "red", icon: "thumbs-up", open: true, since: 1, sublink: "#trending/", scrollable: 'scrollable', translation:{ 'title': 'trending_accounts_we_follow'}}
	],
	
	'initialize' : function()
	{
		// Check for outdated streams
		Cloudwalkers.Session.ping();

		// Translation for Title
		this.translateTitle("dashboard");
	},
	
	'addDynamicReports' : function ()
	{
		var streams =  Cloudwalkers.Session.getStreams();
		var reportables = streams.where({statistics: 1});
		
		var widgets = [];
		
		for(n in reportables)
			switch(reportables[n].get("network").token)
			{
				case "facebook":
					widgets.push({widget: "report", size: 3, stream: reportables[n], type: "numbercomparison/likes", dashboard: true});
					widgets.push({widget: "report", size: 3, stream: reportables[n], type: "besttimetoposttext", dashboard: true});
					break;
					
				case "twitter":
					widgets.push({widget: "report", size: 3, stream: reportables[n], type: "numbercomparison/followers_count", dashboard: true});
					widgets.push({widget: "report", size: 3, stream: reportables[n], type: "besttimetoposttext", dashboard: true});
					break;	
			}
		
		return widgets;
	},
	
	'render' : function ()
	{
		var widgets = this.widgets;

		// Pageview
		this.$el.html (Mustache.render (Templates.pageview, { 'title' : this.title }));
		this.$container = this.$el.find("#widgetcontainer").eq(0);

		/*if (Cloudwalkers.Session.isAuthorized('STATISTICS_VIEW'))
			widgets = widgets.concat(this.addDynamicReports());*/
		
		// Append widgets
		for(i in widgets)
		{
			
			// Translation for each widget
			this.translateWidgets(widgets[i]);

			switch(widgets[i].widget)
			{
				case 'messagescounters':
					var widget = this.addMessagesCounters (widgets[i]);
					break;
					
				case 'schedulecounter':
					var widget = this.addScheduleCounters (widgets[i]);
					break;
					
				case 'coworkers':
					var widget = this.addDashboardDrafts (widgets[i]);
					break;
					
				case 'trending':
					var widget = this.addDashboardTrending (widgets[i]);
					break;
					
				case 'report':
					var widget = new Cloudwalkers.Views.Widgets.Report(widgets[i]);
					break;
			}
			
			if(widget)
				this.appendWidget(widget, Number(widgets[i].size));
		}
		
		return this;
	},
	
	'addMessagesCounters' : function (widgetdata)
	{
		var channel = Cloudwalkers.Session.getChannel(widgetdata.type);
		if(!channel)	return;

		$.extend(widgetdata, {name: channel.get('name'), open: 1, channel: channel});
		
		return new Cloudwalkers.Views.Widgets.MessagesCounters (widgetdata);
	},
	
	'addScheduleCounters' : function (widgetdata)
	{
		
		var channel = Cloudwalkers.Session.getChannel("outgoing");
		
		//channel.outgoing = new Cloudwalkers.Collections.Streams(channel.get("additional").outgoing);
		
		$.extend(widgetdata, {name: channel.get('name'), open: 1, channel: channel});
		
		return new Cloudwalkers.Views.Widgets.MessagesCounters (widgetdata);
	},
	
	'addDashboardDrafts' : function (widgetdata)
	{
		//var channel = Cloudwalkers.Session.getChannel("internal");

		widgetdata.model = Cloudwalkers.Session.getStream("coworkers"); //channel.getStream("coworkers");
		
		if(!widgetdata.model)	return;

		widgetdata.link = "#coworkers";
		
		return new Cloudwalkers.Views.Widgets.DashboardMessageList (widgetdata);
	},

	'addDashboardTrending' : function (widgetdata)
	{
		widgetdata.trending = true;
		widgetdata.model = Cloudwalkers.Session.getChannel(widgetdata.type);
		widgetdata.filters = {
			sort: "engagement",
			since: Math.round(Date.now()/3600000) *3600 - 86400 *widgetdata.since
		};

		if(!widgetdata.model)	return;

		return new Cloudwalkers.Views.Widgets.DashboardMessageList (widgetdata);
	},

	'translateWidgets' : function(translatedata)
	{	
		// Translate Widgets
		if(translatedata.translation)
			for(k in translatedata.translation)
			{
				translatedata[k] = Cloudwalkers.Session.polyglot.t(translatedata.translation[k]);
			}
	},

	'translateTitle' : function(translatedata)
	{	
		// Translate Title
		this.title = Cloudwalkers.Session.polyglot.t(translatedata);
	}
});