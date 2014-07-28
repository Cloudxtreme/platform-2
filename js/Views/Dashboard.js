Cloudwalkers.Views.Dashboard = Cloudwalkers.Views.Pageview.extend({

	'title' : "Dashboard",

	'initialize' : function()
	{

		// Check for outdated streams
		Cloudwalkers.Session.ping();

		// Translation for Title
		this.translateTitle("dashboard");
	},

	'getTemplate' : function()
	{
		var template = new Cloudwalkers.Collections.Widgets();
		var role = Cloudwalkers.Session.user.getRole();
		
		if(role)	role = role.template? role.template.name: null;
		
		switch(role)
		{

			case 'Co-worker':			
			template.startWidgets(['widget_4', 'widget_15', 'widget_16']);
			break;

			case 'Webcare':
			template.startWidgets(['widget_9', 'widget_10', 'widget_11', 'widget_12', 'widget_14']);
			break;

			case 'Editor':
			template.startWidgets(['widget_8', 'widget_13', 'widget_14', 'widget_15', 'widget_16']);
			break;

			case 'Publisher':
			template.startWidgets(['widget_8', 'widget_4', 'widget_2', 'widget_7', 'widget_3']);
			this.addDynamicReports(template);
			break;

			case 'Conversation manager':
			template.startWidgets(['widget_1', 'widget_2', 'widget_3', 'widget_4', 'widget_8', 'widget_5', 'widget_6']);
			this.addDynamicReports(template);
			break;

		}
		return template;
	},

	'addDynamicReports' : function(template)
	{
		var streams =  Cloudwalkers.Session.getStreams();
		var reportables = streams.where({statistics: 1});

		template.add(new Cloudwalkers.Models.Widget({widget: "clear", size: 12}))
		
		for(n in reportables)
			switch(reportables[n].get("network").token)
			{
				case "facebook":
					template.add(new Cloudwalkers.Models.Widget({widget: "report", size: 3, stream: reportables[n], type: "numbercomparison/likes", dashboard: true}))
					template.add(new Cloudwalkers.Models.Widget({widget: "report", size: 3, stream: reportables[n], type: "besttimetoposttext", dashboard: true}))
					break;
					
				case "twitter":
					template.add(new Cloudwalkers.Models.Widget({widget: "report", size: 3, stream: reportables[n], type: "numbercomparison/followers_count", dashboard: true}))
					template.add(new Cloudwalkers.Models.Widget({widget: "report", size: 3, stream: reportables[n], type: "besttimetoposttext", dashboard: true}))
					break;	
			}
	},

	'render' : function ()
	{
		// Pageview
		this.$el.html (Mustache.render (Templates.pageview, { 'title' : this.title }));
		this.$container = this.$el.find("#widgetcontainer").eq(0);

		// Report widgets (dynamic)
		var widgets = this.getTemplate().models;

		// Append widgets
		for(i in widgets)
		{
			// Translation for each widget
			this.translateWidgets(widgets[i].attributes);

			switch(widgets[i].attributes.widget)
			{
				case 'clear':
					var widget = this.addClear (widgets[i].attributes);
					break;
				case 'messagescounters':
					var widget = this.addMessagesCounters (widgets[i].attributes);
					break;
					
				case 'schedulecounter':
					var widget = this.addScheduleCounters (widgets[i].attributes);
					break;
					
				case 'coworkers':
					var widget = this.addDashboardDrafts (widgets[i].attributes);
					break;
					
				case 'trending':
					var widget = this.addDashboardTrending (widgets[i].attributes);
					break;
					
				case 'report':
					var widget = new Cloudwalkers.Views.Widgets.Report(widgets[i].attributes);
					break;

				// New Widgets
				case 'accountswefollow':
					var widget = this.addDashboardAccountsWeFollow (widgets[i].attributes);
					break;

				case 'drafts':
					var widget = this.addDashboardDrafts (widgets[i].attributes);
					break;

				case 'conversation':
					var widget = this.addDashboardConversation (widgets[i].attributes);
					break;

				case 'write':
					var widget = this.addDashboardWrite (widgets[i].attributes);
					break;

				// Webcare
				case 'webcarecounter':
					var widget = this.addDashboardWebcare (widgets[i].attributes);
					break;
			}
			
			this.appendWidget(widget, Number(widgets[i].attributes.size));
		}
		
		return this;
	},
	'addClear' : function (widgetdata)
	{
		return new Cloudwalkers.Views.Widgets.DashboardCleaner (widgetdata);
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
		
		$.extend(widgetdata, {name: channel.get('name'), open: 1, channel: channel});
		
		return new Cloudwalkers.Views.Widgets.MessagesCounters (widgetdata);
	},

	'addDashboardDrafts' : function (widgetdata)
	{
		
		widgetdata.model = Cloudwalkers.Session.getStream(widgetdata.type);
		
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
		return new Cloudwalkers.Views.Widgets.DashboardMessageList (widgetdata);
	},

	'addDashboardAccountsWeFollow' : function (widgetdata)
	{
		widgetdata.trending = false;
		widgetdata.model = Cloudwalkers.Session.getChannel(widgetdata.type);
		widgetdata.filters = {
			since: Math.round(Date.now()/3600000) *3600 - 86400 *widgetdata.since
		};
		return new Cloudwalkers.Views.Widgets.DashboardMessageList (widgetdata);
	},

	'addDashboardConversation' : function (widgetdata)
	{
		
		widgetdata.timespan = {
			sort: widgetdata.sort,
			since: Math.round(Date.now()/3600000) *3600 - 86400 *widgetdata.since
		};

		return new Cloudwalkers.Views.Widgets.TrendingMessage (widgetdata);
	},

	'addDashboardWebcare' : function (widgetdata)
	{
		
		widgetdata.model = Cloudwalkers.Session.getStream(widgetdata.type);
		
		return new Cloudwalkers.Views.Widgets.DashboardWebcare (widgetdata);

	},
	
	'addDashboardWrite' : function (widgetdata)
	{
		widgetdata.parent = Cloudwalkers.Session.getAccount();

		if(widgetdata.type == "draft")
			widgetdata.model = new Cloudwalkers.Models.Message();
		
		return new Cloudwalkers.Views.Widgets.DashboardWrite (widgetdata);

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