Cloudwalkers.Views.Widgets.NewCombinedStatistics = Backbone.View.extend({

	'streamid': 216,
	'reports' : {
		'facebook' : ['fans', 'posts', 'activity', 'impressions']
	},
	//Info rendering stuff
	'funcs' : {
		'fans' : {data : {title: "Fans Evolution", filterfunc: "contact-evolution-network"}, span: 3},
		'posts' : {data : {title: "Posts Evolution", filterfunc: "post-activity-network"}, span: 3},
		'activity' : {data : {title: "Activity Evolution", filterfunc: "activity-network"}, span: 3},
		'impressions' : {data : {title: "Impressions evolution", filterfunc: "page-views-network"}, span: 3}
	},
	//Chart rendering stuff
	'charts' : [ //Change network to dynamic <-
		{data : {title: "Single network chart", chart: 'LineChart', filterfunc: "evolution", type: "activities", network: true}, span: 6},
		{data : {title: "Multiple network chart", chart: 'LineChart', filterfunc: "evolution", type: "activities"}, span: 6}
	],

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

		$.extend(this.settings, this.getstreamcontext(this.streamid));		

		this.$el.html (Mustache.render (Templates.newcombinedstatistics, this.settings));
		
		return this;
	},

	'fill' : function()
	{	
		if(this.filled)	return true;

		var data;
		var width = this.$el.find("#singlenetwork").get(0).clientWidth;
		
		//Render data
        this.fillcharts();
        this.fillinfo(this.settings.reports);

        this.filled = true;	
	},

	'fillcharts' : function()
	{	//Fills charts & adds them to DOM
        var charts = this.charts;

        for(n in charts){
			charts[n].data.model = this.model;
			if(charts[n].data.network)	charts[n].data.network = this.network;

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
			view = new Cloudwalkers.Views.Widgets.Info(this.funcs[reports[n]].data);
			this.parent.appendWidget(view, 3);
		};
	},

	'getstreamcontext' : function(streamid)
	{
		var context = {};
		var network = Cloudwalkers.Session.getStream(streamid).get("network");
		
		context.reports = this.reports[network.token];
		context.network = network;
		
		return context;
	},

	'negotiateFunctionalities' : function()
	{

	}
	
});