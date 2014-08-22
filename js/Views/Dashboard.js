Cloudwalkers.Views.Dashboard = Cloudwalkers.Views.Pageview.extend({

	'title' : "Dashboard",
	'views' : [],

	'events' : {
		'change #select_dashboard' : 'selectDashboard'
	},

	'initialize' : function()
	{

		// Check for outdated streams
		Cloudwalkers.Session.ping();

		// Translation for Title
		this.translateTitle("dashboard");

		// Reports
		this.model = Cloudwalkers.Session.getAccount();
		this.model.statistics = new Cloudwalkers.Collections.Statistics();
		
		this.listenTo(this.model.statistics, 'seed', this.filldynamicreports);

		// get roles list
		this.roles = Cloudwalkers.Session.getAccount().get('roles');
	},

	'getTemplate' : function(selectedrole)
	{
		var template = new Cloudwalkers.Collections.Widgets();
		
		var role = Cloudwalkers.Session.user.getRole();
		if(role)	role = role.template? role.template.name: null;
		
		if(selectedrole)
			role = selectedrole;

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
		/*var streams =  Cloudwalkers.Session.getStreams();
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
		*/
	},

	'filldynamicreports' : function()
	{	
		var streams =  Cloudwalkers.Session.getStreams();
		var reportables = streams.where({statistics: 1});

		this.appendWidget(new Cloudwalkers.Views.Widgets.DashboardCleaner ({size: 12}), 12)

		for(n in reportables)
		{
			this.fillstreamwidget(reportables[n].id)
		}		
			
		//	this.appendWidget(view, this.widgets[n].span);
	},

	'fillstreamwidget' : function(stream)
	{
		var widgets = [
			{widget: "Info", data: {title: "New impressions", filterfunc: "page-views-network"}, span: 3},
			{widget: "Info", data: {title: "New shares", filterfunc: "shares"}, span: 3},
			{widget: "Info", data: {title: "New posts", filterfunc: "posts"}, span: 3},
			{widget: "Info", data: {title: "New direct messages", filterfunc: "dms"}, span: 3}
		]

		for(n in widgets)
		{	
			var token = Cloudwalkers.Session.getStream(stream).get("network").token;

			widgets[n].data.network = stream;
			widgets[n].data.model = this.model;
			widgets[n].data.footer = Cloudwalkers.Session.getStream(stream).get("defaultname");
	
			var view = new Cloudwalkers.Views.Widgets[widgets[n].widget] (widgets[n].data);

			this.views.push(view);
			this.appendWidget(view, widgets[n].span);
		}
	},

	'render' : function (selectedrole)
	{
		// Pageview
		var data = {};

		// Dashboard Select switch (true|false)
		data.dashboardselect = true;

		// Roles list for Dashboard Select
		data.roles = [];
		for (var i = 0; i < this.roles.length; i ++)
		{
			var tmp = this.roles[i];
			
			tmp.checked = selectedrole == this.roles[i].name;

			data.roles.push (tmp);
		}

		// Title
		data.title = this.title;

		this.$el.html (Mustache.render (Templates.pageview, data));
		this.$container = this.$el.find("#widgetcontainer").eq(0);

		// Report widgets (dynamic)
		var widgets = this.getTemplate(selectedrole).models;

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

		this.model.statistics.touch(this.model, this.filterparameters());
		
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
			
		return new Cloudwalkers.Views.Widgets.DashboardWebcare (widgetdata);

	},
	
	'addDashboardWrite' : function (widgetdata)
	{
		widgetdata.parent = Cloudwalkers.Session.getAccount();

		if(widgetdata.type == "draft")
			widgetdata.model = new Cloudwalkers.Models.Message();
		
		return new Cloudwalkers.Views.Widgets.DashboardWrite (widgetdata);

	},

	'filterparameters' : function() {
 
		this.start = moment().zone(0).startOf('isoweek');
		this.end = moment().zone(0).endOf('isoweek'); 
		
		return {since: this.start.unix(), until: this.end.unix()};
	},

	'selectDashboard' : function(e){
		this.render($(e.target).val())
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