Cloudwalkers.Views.Widgets.NewCombinedStatistics = Backbone.View.extend({

	'streamid': 216,
	'reports' : {
		'facebook' : ['fans', 'posts', 'activity', 'impressions', 'notifications'],
		'twitter' : ['followers', 'following', 'posts', 'mentions', 'retweets'],
		'youtube' : ['fans', 'posts']
	},
	//Info rendering stuff
	'funcs' : {
		'fans' : {data : {title: "Fans Evolution", filterfunc: "contact-evolution-network"}, span: 3},
		'posts' : {data : {title: "Posts Evolution", filterfunc: "post-activity-network"}, span: 3},
		'activity' : {data : {title: "Activity Evolution", filterfunc: "activity-network"}, span: 3},
		'impressions' : {data : {title: "Impressions evolution", filterfunc: "page-views-network"}, span: 3},
		'notifications' : {data : {title: "Notifications evolution", filterfunc: "notifications"}, span: 3},
		'followers' : {data : {title: "Followers evolution", filterfunc: "followers"}, span: 3},
		'following' : {data : {title: "Following evolution", filterfunc: "following"}, span: 3},
		'mentions' : {data : {title: "mentions evolution", filterfunc: "mentions"}, span: 3},
		'retweets' : {data : {title: "Retweet evolution", filterfunc: "retweets"}, span: 3}
	},
	//Chart rendering stuff
	'charts' : [ //Change network to dynamic <-
		{data : {chart: 'LineChart', filterfunc: "evolution", network: true}, span: 6},
		{data : {chart: 'LineChart', filterfunc: "evolution"}, span: 6}
	],

	'titles' : {
		'contacts' : 'Contact evolution',
		'messages' : 'Message evolution',
		'activities' : 'Activity evolution',
		'impressions' : 'Impression evolution',
		'notifications' : 'Notification evolution'
	},

	'initialize' : function (options)
	{
		if(options) $.extend(this, options);
		view = this;
		this.collection = this.model.statistics;	
	
		this.listenTo(this.collection, 'ready', this.fill);
	},

	'render' : function ()
	{	
		// Create view
		this.settings = {};
		this.settings.title = this.title;

		$.extend(this.settings, this.getstreamcontext(this.network));		

		this.$el.html (Mustache.render (Templates.newcombinedstatistics, this.settings));
		
		return this;
	},

	'fill' : function()
	{	
		if(this.filled)	return true;
		
		//Render data
        this.fillcharts();
        if(this.renderinfos)
        	this.fillinfo(this.settings.reports);

        this.filled = true;	
	},

	'fillcharts' : function()
	{	//Fills charts & adds them to DOM
        var charts = this.charts;

        for(n in charts){
			charts[n].data.model = this.model;
			if(charts[n].data.network)	charts[n].data.network = this.network;
			charts[n].data.type = this.type;
			charts[n].data.title = this.titles[this.type];
			view = new Cloudwalkers.Views.Widgets.Chart(this.charts[n].data);
			this.parent.appendWidget(view, 6);
		};
	},

	'fillinfo' : function(reports)
	{	
		var data;
		var view;

		for(n in reports){			
			this.funcs[reports[n]].data.model = this.model;
			this.funcs[reports[n]].data.network = this.network;
			this.funcs[reports[n]].data.icon = this.icon;
			this.funcs[reports[n]].data.footer = "+ 0 (+ 0%) SINCE LAST 7 DAYS";
			view = new Cloudwalkers.Views.Widgets.Info(this.funcs[reports[n]].data);
			this.parent.appendWidget(view, 3);
		};
		this.parent.appendWidget(null, 0);
	},

	'getstreamcontext' : function(streamid)
	{
		var context = {};
		//var network = Session.getStream(streamid).get("network");
		
		context.reports = this.reports[streamid];
		//context.network = network;
		
		return context;
	},

	'negotiateFunctionalities' : function()
	{

	}
	
});