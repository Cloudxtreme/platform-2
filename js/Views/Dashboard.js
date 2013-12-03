Cloudwalkers.Views.Dashboard = Cloudwalkers.Views.Pageview.extend({

	'title' : 'Dashboard',
	'widgets' : [
		{widget: "channelcounter", type: "inbox", size: 4, title: "Inbox", icon: "inbox", open: true, counter: true},
		{widget: "channelcounter", type: "monitoring", size: 4, title: "Keywords", icon: "tags", open: true, counter: true},
		{widget: "schedulecounter", type: "news", size: 4, title: "Schedule", icon: "time", open: true, counter: true},
		{widget: "coworkers", type: "drafts", size: 4, title: "Co-worker drafts", color: "yellow", icon: "edit", open: true, link: "#coworkers"},
		{widget: "trending", type: "profiles", size: 4, title: "Trending Company Posts", color : "grey", icon: "thumbs-up", open: true, since: 7},
		{widget: "trending", type: "news", size: 4, title: "Trending Profiles we follow", color: "red", icon: "thumbs-up", open: true, since: 1}
	],
	
	'initialize' : function ()
	{
		
		 // HACK
        Cloudwalkers.Session.on("change:streams", this.rebuild, this);
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
		
		this.$el.addClass("container-fluid");
		this.$container = this.$el.find("#widgetcontainer").eq(0);
		
		// Report widgets (dynamic)
		var widgets = this.widgets.concat(this.addDynamicReports());
		
		// Append widgets
		for(n in widgets)
		{
			switch(widgets[n].widget)
			{
				case 'channelcounter':
					var widget = this.addDashboardChannelCounter (widgets[n]);
					break;
					
				case 'schedulecounter':
					var widget = new Cloudwalkers.Views.Widgets.ScheduleCounter(widgets[n]);
					break;
					
				case 'coworkers':
					var widget = this.addInboxCoworkers (widgets[n]);
					break;
					
				case 'trending':
					var widget = this.addDashboardTrending (widgets[n]);
					break;
					
				case 'report':
					var widget = new Cloudwalkers.Views.Widgets.Report(widgets[n]);
					break;
			}
			
			this.appendWidget(widget, Number(widgets[n].size));
		}

		return this;
	},
	
	'addDashboardChannelCounter' : function (widgetdata)
	{
		
		var channel = Cloudwalkers.Session.getChannels().findWhere({type: widgetdata.type});
		
		$.extend(widgetdata, {name: channel.get('name'), open: 1, channel: channel});
		
		return new Cloudwalkers.Views.Widgets.ChannelCounters (widgetdata);
	},
	
	'addInboxCoworkers' : function (widgetdata)
	{
		widgetdata.channel = Cloudwalkers.Session.getChannels().findWhere({type: "internal"});
		widgetdata.link = "#coworkers";
		
		var draftstreams = widgetdata.channel.get("streams").filter(function(stream){ return stream.token=="draft"});
		
		if(draftstreams.length)
			widgetdata.streamid = draftstreams.pop().id;
		
		//var streamid = draftstreams.pop().id;
		//widgetdata.stream = Cloudwalkers.Session.getStream(streamid);
		
		return new Cloudwalkers.Views.Widgets.DashboardMessageList (widgetdata);
	},

	'addDashboardTrending' : function (widgetdata)
	{
		
		
		widgetdata.channel = Cloudwalkers.Session.getChannels().findWhere({type: widgetdata.type});
		widgetdata.channel.messages.parameters.sort = "engagement";
		
		if(widgetdata.since)
		{
			var since = Math.round(Date.now()/1000);
			widgetdata.channel.messages.parameters.since = since - 86400 *widgetdata.since;
		}

		return new Cloudwalkers.Views.Widgets.DashboardMessageList (widgetdata);
	},
	
	// HACK
	'rebuild' : function ()
	{
		if(this.$el.find(".span3").size()) return null;
		
		var widgets = this.addDynamicReports();
		
		for(n in widgets)
			this.appendWidget(
				new Cloudwalkers.Views.Widgets.Report(widgets[n]),
				Number(widgets[n].size)
			);
	}
});