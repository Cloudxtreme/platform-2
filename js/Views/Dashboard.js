Cloudwalkers.Views.Dashboard = Cloudwalkers.Views.Pageview.extend({

	'title' : "Dashboard",
	'widgets' : [
		{widget: "messagescounters", type: "inbox", source: "streams", size: 4, title: "Inbox", icon: "inbox", open: true, counter: true, link: "#inbox"},
		{widget: "messagescounters", type: "monitoring", source: "channels", size: 4, title: "Keywords", icon: "tags", open: true, counter: true},
		{widget: "schedulecounter", type: "schedule", source: "outgoing", size: 4, title: "Schedule", icon: "time", open: true, counter: true},
		{widget: "coworkers", type: "drafts", size: 4, title: "Co-workers wall", color: "yellow", icon: "edit", open: true, link: "#coworkers"},
		{widget: "trending", type: "profiles", size: 4, title: "Trending Company Posts", color : "grey", icon: "thumbs-up", open: true, since: 7},
		{widget: "trending", type: "news", size: 4, title: "Trending Profiles we follow", color: "red", icon: "thumbs-up", open: true, since: 1}
	],
	
	
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
					widgets.push({widget: "report", size: 3, stream: reportables[n], type: "besttimetoposttext/", dashboard: true});
					break;
					
				case "twitter":
					widgets.push({widget: "report", size: 3, stream: reportables[n], type: "numbercomparison/followers_count", dashboard: true});
					widgets.push({widget: "report", size: 3, stream: reportables[n], type: "besttimetoposttext/", dashboard: true});
					break;	
			}
		
		return widgets;
	},
	
	'render' : function ()
	{
		
		this.$el.html (Mustache.render (Templates.pageview, { 'title' : this.title }));
		this.$container = this.$el.find("#widgetcontainer").eq(0);
		
		// Report widgets (dynamic)
		var widgets = this.widgets.concat(this.addDynamicReports());
		
		// Append widgets
		for(i in widgets)
		{
			switch(widgets[i].widget)
			{
				case 'messagescounters':
					var widget = this.addMessagesCounters (widgets[i]);
					break;
					
				case 'schedulecounter':
					var widget = this.addScheduleCounters (widgets[i]);//var widget = new Cloudwalkers.Views.Widgets.ScheduleCounter(widgets[n]);
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
			
			this.appendWidget(widget, Number(widgets[i].size));
		}

		return this;
	},
	
	'addMessagesCounters' : function (widgetdata)
	{
		
		var channel = Cloudwalkers.Session.getChannel(widgetdata.type);
		
		$.extend(widgetdata, {name: channel.get('name'), open: 1, channel: channel});
		
		return new Cloudwalkers.Views.Widgets.MessagesCounters (widgetdata);
	},
	
	'addScheduleCounters' : function (widgetdata)
	{
		
		var channel = Cloudwalkers.Session.getChannel("internal");
		
		channel.outgoing = new Cloudwalkers.Collections.Streams(channel.get("additional").outgoing);
		
		// Prep and sort list
		/*channel.attributes.outgoing = [];
		
		$.each(channel.attributes.additional.outgoing, function(n, entry)
		{
			channel.attributes.outgoing.push($.extend(entry, {unread: entry.count.scheduled})); 
		});*/
		
		$.extend(widgetdata, {name: channel.get('name'), open: 1, channel: channel});
		
		return new Cloudwalkers.Views.Widgets.MessagesCounters (widgetdata);
	},
	
	'addDashboardDrafts' : function (widgetdata)
	{
		var channel = Cloudwalkers.Session.getChannel("internal");

		widgetdata.model = channel.getStream("draft");
		widgetdata.link = "#coworkers";
		
		return new Cloudwalkers.Views.Widgets.DashboardMessageList (widgetdata);
	},

	'addDashboardTrending' : function (widgetdata)
	{
		widgetdata.model = Cloudwalkers.Session.getChannel(widgetdata.type);
		widgetdata.filters = {
			sort: "engagement",
			since: Math.round(Date.now()/1000) - 86400 *widgetdata.since
		};

		return new Cloudwalkers.Views.Widgets.DashboardMessageList (widgetdata);
	}
});