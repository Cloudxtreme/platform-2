define(
	['mustache', 'Session', 'Views/Pageview', 'Collections/Statistics', 'Views/Widgets/DashboardCleaner', 'Views/Widgets/Report',
	 'Views/Widgets/MessagesCounters', 'Views/Widgets/DashboardMessageList', 'Views/Widgets/Info'],

	function (Mustache, Session, Pageview, StatisticsCollection, DashboardCleanerWidget, ReportWidget, 
			  MessagesCountersWidget, DashboardMessageListWidget, InfoWidget)
	{ console.log(Pageview)
		var Dashboard = Pageview.extend({

			title : "Dashboard",
			statistics : [],
			
			widgets : [
				{widget: "messagescounters", type: "inbox", source: "streams", size: 4, title: "Inbox", icon: "inbox", open: true, counter: true, typelink: "#inbox", countString: "incomingUnread", scrollable: 'scrollable', translation: {'title': 'inbox'}},
				{widget: "messagescounters", type: "monitoring", source: "channels", size: 4, title: "Keywords", icon: "tags", open: true, counter: true, countString: "incoming", scrollable: 'scrollable', translation: { 'title': 'keywords'}},
				{widget: "schedulecounter", type: "schedule", source: "streams", size: 4, title: "Schedule", icon: "time", open: true, counter: true, countString: "scheduled", link: "#scheduled", scrollable: 'scrollable', translation:{ 'title': 'schedule'}},
				{widget: "coworkers", type: "drafts", size: 4, title: "Co-workers wall", color: "yellow", icon: "edit", open: true, link: "#coworkers", scrollable: 'scrollable', translation: { 'title': 'co-workers_wall'}},
				{widget: "trending", type: "profiles", size: 4, title: "Trending Company Posts", color : "grey", icon: "thumbs-up", open: true, since: 7, sublink: "#trending/", scrollable: 'scrollable', translation:{ 'title': 'trending_company_posts'}},
				{widget: "trending", type: "news", size: 4, title: "Trending Accounts we follow", color: "red", icon: "thumbs-up", open: true, since: 1, sublink: "#trending/", scrollable: 'scrollable', translation:{ 'title': 'trending_accounts_we_follow'}}
			],
			
			initialize : function()
			{
				// Check for outdated streams
				Session.ping();

				// Translation for Title
				this.translateTitle("dashboard");

				// Reports
				this.collection = new StatisticsCollection();
				
				this.listenTo(this.collection, 'seed', this.filldynamicreports);
			},

			filldynamicreports : function()
			{	
				var streams =  Session.getStreams();
				var reportables = streams.where({statistics: 1});

				this.appendWidget(new DashboardCleanerWidget ({size: 12}), 12)

				for(n in reportables)
				{
					this.fillstreamwidget(reportables[n].id)
				}		
					
				//	this.appendWidget(view, this.widgets[n].span);
			},

			fillstreamwidget : function(stream)
			{	
				var token = Session.getStream(stream).get("network").token;
				var title = token == 'facebook'? 'Likes': 'Followers';
				var widgets = [
					{widget: "Info", data: {title: title, filterfunc: "followers"}, span: 3},
					{widget: "Info", data: {title: "Best time to post", filterfunc: "besttimetopost"}, span: 3},
				]

				for(n in widgets)
				{
					if(token != 'facebook' && token != 'twitter')
						continue;

					widgets[n].data.network = stream;
					widgets[n].data.parentview = this;
					widgets[n].data.footer = Session.getStream(stream).get("defaultname");

					if(widgets[n].data.filterfunc != "besttimetopost")
						widgets[n].data.footer = widgets[n].data.footer + ' ' + title;
			
					var view = new InfoWidget (widgets[n].data);

					this.statistics.push(view);
					this.appendWidget(view, widgets[n].span);
				}
			},
			
			render : function ()
			{
				var widgets = this.widgets;

				// Pageview
				this.$el.html (Mustache.render (Templates.pageview, { 'title' : this.title }));
				this.$container = this.$el.find("#widgetcontainer").eq(0);
				
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
							var widget = new ReportWidget(widgets[i]);
							break;
					}
					
					if(widget)
						this.appendWidget(widget, Number(widgets[i].size));
				}
				
				this.collection.touch(this.filterparameters());

				return this;
			},
			
			addMessagesCounters : function (widgetdata)
			{
				var channel = Session.getChannel(widgetdata.type);
				if(!channel)	return;

				$.extend(widgetdata, {name: channel.get('name'), open: 1, channel: channel});
				
				return new MessagesCountersWidget (widgetdata);
			},
			
			addScheduleCounters : function (widgetdata)
			{
				var channel = Session.getChannel("outgoing");
				
				$.extend(widgetdata, {name: channel.get('name'), open: 1, channel: channel});
				
				return new MessagesCountersWidget (widgetdata);
			},
			
			addDashboardDrafts : function (widgetdata)
			{
				widgetdata.model = Session.getStream("coworkers");
				
				if(!widgetdata.model)	return;

				widgetdata.link = "#coworkers";
				
				return new DashboardMessageListWidget (widgetdata);
			},

			addDashboardTrending : function (widgetdata)
			{
				widgetdata.trending = true;
				widgetdata.model = Session.getChannel(widgetdata.type);
				widgetdata.filters = {
					sort: "engagement",
					since: Math.round(Date.now()/3600000) *3600 - 86400 *widgetdata.since
				};

				if(!widgetdata.model)	return;

				return new DashboardMessageListWidget (widgetdata);
			},

			filterparameters : function() {
		 
				this.start = moment().zone(0).startOf('isoweek');
				this.end = moment().zone(0).endOf('isoweek'); 
				
				return {since: this.start.unix(), until: this.end.unix()};
			},

			translateWidgets : function(translatedata)
			{	
				// Translate Widgets
				if(translatedata.translation)
					for(k in translatedata.translation)
					{
						translatedata[k] = Session.polyglot.t(translatedata.translation[k]);
					}
			},

			translateTitle : function(translatedata)
			{	
				// Translate Title
				this.title = Session.polyglot.t(translatedata);
			}
		});

		return Dashboard;
	}
);