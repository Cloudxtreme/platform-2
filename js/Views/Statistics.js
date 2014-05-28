Cloudwalkers.Views.Statistics = Cloudwalkers.Views.Pageview.extend({
	
	'id' : "statistics",
	'start' : 0,
	'end': 0,
	'timespan' : "week",
	'period' : 0,
	'custom' : false,
	'views' : [],
	
	'events' : {
		'remove': 'destroy',
		'click #add': 'addperiod',
		'click #subtract': 'subtractperiod',
		'click #now': 'changespan',
		'click #show': 'changecustom',
		'change .stats-header select.networks': 'changestream',
		'change .stats-header select.time': 'changespan',
		'click .dashboard-stat' : 'updatenetwork'
	},

	'networkspecific' : {
		'typeA' : { 
			'facebook' : {filterfunc: "age", chart: "PieChart", title: "By Age"},
			'twitter' : {filterfunc: "follow", chart: "PieChart", title: "By Followers"},
			'linkedin' : {filterfunc: "follow", chart: "PieChart", title: "By Followers"},
			'youtube' : {filterfunc: "follow", chart: "PieChart", title: "By Followers"}
		},
		'typeB' : { 
			'facebook' : {filterfunc: "gender", chart: "PieChart", title: "By gender"},
			'twitter' : {filterfunc: "nodata", chart: "PieChart", title: "No data"},
			'youtube' : {filterfunc: "nodata", chart: "PieChart", title: "No data"},
			'linkedin' : {filterfunc: "nodata", chart: "PieChart", title: "No data"},
		},
	},
	
	'widgets' : [
		{widget: "StatSummary", data: {columnviews: ["contacts", "score-trending", "outgoing", "coworkers"]}, span: 12},

		{widget: "TitleSeparator", data: {title: "Contacts info"}},
		{widget: "Chart", data: {filterfunc: "contacts", chart: "PieChart", title: "Contacts", display: "divided"}, span: 6},
		{widget: "CompoundChart", span: 6, data : { template: "2col1row", chartdata: [ 
			{widget: "Chart", data: {filterfunc: "age", chart: "PieChart", title: "By Age"}},
			{widget: "Chart", data: {filterfunc: "gender", chart: "PieChart", title: "By Gender"}},
			{widget: "Chart", data: {filterfunc: "contact-evolution", chart: "LineChart", title: "Contacts Evolution"}}
			]}
		},
		//{widget: "Chart", data: {filterfunc: "age", chart: "PieChart", title: "By Age"}, span: 3},
		//{widget: "Chart", data: {filterfunc: "gender", chart: "PieChart", title: "By Gender"}, span: 3},
		
		{widget: "TitleSeparator", data: {title: "New this"}},
		{widget: "Info", data: {title: "Contact Evolution", filterfunc: "contact-evolution"}, span: 3},
		{widget: "Info", data: {title: "Post Activity", filterfunc: "post-activity"}, span: 3},
		{widget: "Info", data: {title: "Activity?", filterfunc: "activity"}, span: 3},
		{widget: "Info", data: {title: "Page Views?", filterfunc: "page-views"}, span: 3},

		{widget: "TitleSeparator", data: {title: "Messages info"}},
		{widget: "TrendingMessage", data: {title: "Top rated comment"}, span: 12},
		{widget: "BestTimeToPost", data: {filterfunc: "besttime", chart: "LineChart", title: "Best Time to Post"}, span: 4},
		{widget: "Chart", data: {filterfunc: "message-evolution", chart: "LineChart", title: "Messages Evolution"}, span: 4},
		{widget: "HeatCalendar", data: {filterfunc: "activity", title: "Activity Calendar"}, span: 4},

		{widget: "TitleSeparator", data: {title: "Geo Graphics"}},
		{widget: "Chart", data: {filterfunc: "geo", type: "dots", chart: "GeoChart", title: "Countries", connect : true}, span: 8},
		{widget: "CompoundChart", span: 4, data : { template: "2row", chartdata: [ 
			{widget: "Chart", data: {filterfunc: "regional", chart: "PieChart", title: "Countries"}, connect: 'regional'},
			{widget: "Chart", data: {filterfunc: "cities", chart: "PieChart", title: "Cities"}}
			]}
		},

		// ** Network context widgets **
		{widget: "StatSummary", data: {columnviews: ["contacts-network", "score-trending-network", "outgoing-network", "coworkers"]}, span: 12},

		{widget: "TitleSeparator", data: {title: "Contacts info"}},
		{widget: "Chart", data: {filterfunc: "contact-evolution-network", chart: "LineChart", title: "Contacts Evolution"}, span : 6},
		{widget: "Chart", data: 'typeA', span : 3},
		{widget: "Chart", data: 'typeB', span : 3},

		{widget: "TitleSeparator", data: {title: "Network info"}},
		{widget: "Info", data: {title: "Impressions", filterfunc: "page-views-network"}, span: 3},
		{widget: "Info", data: {title: "Shares", filterfunc: "shares"}, span: 3},
		{widget: "Info", data: {title: "Posts", filterfunc: "posts"}, span: 3},
		{widget: "Info", data: {title: "Direct messages", filterfunc: "dms"}, span: 3},

		{widget: "TitleSeparator", data: {title: "Messages info"}},
		{widget: "TrendingMessage", data: {title: "Top rated comment"}, span: 12},
		{widget: "Chart", data: {filterfunc: "message-evolution-network", chart: "LineChart", title: "Messages Evolution"}, span : 6},
		{widget: "HeatCalendar", data: {filterfunc: "activity", title: "Activity Calendar"}, span: 6},

		{widget: "TitleSeparator", data: {title: "Geo Graphics"}},
		{widget: "Chart", data: {filterfunc: "geo", type: "dots", chart: "GeoChart", title: "Countries", connect : true}, span: 8},
		{widget: "CompoundChart", span: 4, data : { template: "2row", chartdata: [ 
			{widget: "Chart", data: {filterfunc: "regional", chart: "PieChart", title: "Countries"}, connect: 'regional'},
			{widget: "Chart", data: {filterfunc: "cities", chart: "PieChart", title: "Cities"}}
			]}
		},
		/*{widget: "Chart", data: {filterfunc: "regional", chart: "PieChart", title: "Regional Popularity", connect: true}, span: 6},
		{widget: "Chart", data: {filterfunc: "networks", chart: "PieChart", title: "Countries", connect: 'regional'}, span: 3},
		{widget: "Chart", data: {filterfunc: "cities", chart: "PieChart", title: "Cities", connect: 'regional'}, span: 3},
		
		{widget: "Chart", data: {filterfunc: "besttime", chart: "LineChart", title: "Best Time to Post"}, span: 6},
		{widget: "HeatCalendar", data: {filterfunc: "activity", title: "Activity Calendar"}, span: 6},
		//{widget: "Chart", data: {filterfunc: "activity", chart: "Calendar", title: "Activity Calendar"}, span: 6}
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"facebook", icon: "facebook", type:"contacts"}, span: 12},
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"facebook", icon: "facebook", type:"messages"}, span: 12},
		//{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"facebook", icon: "facebook", type:"activities"}, span: 12},
		//{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"facebook", icon: "facebook", type:"impressions"}, span: 12},
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"facebook", icon: "facebook", type:"notifications", renderinfos: true}, span: 12},
		
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"twitter", icon: "twitter", type:"followers"}, span: 12},
		//{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"twitter", icon: "twitter", type:"following"}, span: 12},
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"twitter", icon: "twitter", type:"messages"}, span: 12},
		//{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"twitter", icon: "twitter", type:"mentions"}, span: 12},
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"twitter", icon: "twitter", type:"notifications", renderinfos: true}, span: 12},

		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"youtube", icon: "youtube", type:"contacts"}, span: 12},
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"youtube", icon: "youtube", type:"messages"}, span: 12},
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"youtube", icon: "youtube", type:"notifications", renderinfos: true}, span: 12},

		/*{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"mobile-phone", icon: "mobile-phone", type:"contacts"}, span: 12},
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"mobile-phone", icon: "mobile-phone", type:"messages"}, span: 12},
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"mobile-phone", icon: "mobile-phone", type:"activities"}, span: 12},
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"mobile-phone", icon: "mobile-phone", type:"impressions"}, span: 12},

		{widget: "NetworkStatistics", data: {chart: "LineChart", network:"facebook", icon: "facebook"}, span: 12},
		{widget: "NetworkStatistics", data: {chart: "LineChart", network:"twitter", icon: "twitter"}, span: 12},
		{widget: "NetworkStatistics", data: {chart: "LineChart", network:"youtube", icon: "youtube"}, span: 12},
		{widget: "NetworkStatistics", data: {chart: "LineChart", network:"mobile-phone", icon: "mobilhe-phone"}, span: 12},

		{widget: "Chart", data: {filterfunc: "geo", chart: "GeoChart", title: "Countries"}, span: 12},
		{widget: "Chart", data: {filterfunc: "geo", type: "dots", chart: "GeoChart", title: "Countries"}, span: 12},

		{widget: "TopComment", data: {title: "Top rated comment"}, span: 12}*/



	],
	
	'initialize' : function(options)
	{
		if (options) $.extend(this, options);

		// Check if collection exists
		if(!this.model.statistics) this.model.statistics = new Cloudwalkers.Collections.Statistics();
		
		// Which collection to focus on
		this.collection = this.model.statistics;
		
		// Listen to model
		this.listenTo(this.collection, 'request', this.showloading);
		this.listenTo(this.collection, 'ready', this.hideloading);
		this.listenTo(Cloudwalkers.RootView, "resize", this.resize);
		
		google.load('visualization', '1',  {'callback': function () { this.gloaded = true; }.bind(this), 'packages':['corechart']});
		
	},
	
	resize : function(){
		//this.render();
	},

	'showloading' : function ()
	{
		this.$el.addClass("loading");
	},
	
	'hideloading' : function (collection, response)
	{
		this.$el.removeClass("loading");
	},
	
	'render' : function()
	{	
		// clean if time toggle
		this.cleanviews();
		
		var params = this.timemanager();
		params.streams = [];
		
		// Select streams
		this.model.streams.each (function(stream)
		{
			if(stream.get(this.check)) params.streams.push({id: stream.id, icon: stream.get("network").icon, name: stream.get("defaultname"), network: stream.get("network")}); 

		}.bind(this));
		
		console.log(params)
		
		// Build Pageview
		this.$el.html (Mustache.render (Templates.statsview, params));
		this.$container = this.$el.find("#widgetcontainer").eq(0);
		
		// Chosen
		this.$el.find("select").chosen({width: "200px", disable_search_threshold: 10, inherit_select_classes: true});
		
		// Date picker
		if (this.timespan == "custom")
			this.$el.find('#start, #end').datepicker({format: 'dd-mm-yyyy'});
		
		if(this.gloaded)
			this.fillcharts();
		else
			google.setOnLoadCallback(this.fillcharts.bind(this));

		return this;
	
	},

	'fillcharts' : function(){

		for(n in this.widgets)
		{	
			//MAKE THIS DYNAMIC
			this.network = "twitter";

			if(_.isString(this.widgets[n].data))
				this.widgets[n].data = this.networkspecific[this.widgets[n].data][this.network];
			
			this.widgets[n].data.network = this.network;
			this.widgets[n].data.model = this.model;
			this.widgets[n].data.parent = this;
			this.widgets[n].data.visualization = google.visualization;
			this.widgets[n].data.timespan = {since : this.start.unix(), to : this.end.unix()}

			//pass regional data
			_.isString(this.widgets[n].data.connect) ? this.widgets[n].data.connect = this.connect : false;

			if(this.widgets[n].data.title == "New this")
				this.widgets[n].data.title = "New this "+this.timespan;

			var view = new Cloudwalkers.Views.Widgets[this.widgets[n].widget] (this.widgets[n].data);
			this.widgets[n].data.connect == true ? this.connect = view : false;
			
			this.views.push(view);
			this.appendWidget(view, this.widgets[n].span);
		}

		// Load statistics
		this.collection.touch(this.model, this.filterparameters());

	},
	
	'timemanager' : function ()
	{
		// Get parameters
		var params = this.filterparameters();
		
		var start = moment.unix(params.since);
		var startformat = (start.date() > 24 || params.span == "quarter")? (start.month() == 11? "DD MMM YYYY":"DD MMM"): "DD";
		
		params.periodstring = (!this.period && params.span != "custom")? "this ": (this.period==-1? "last ": "");
		params.timeview = start.format(startformat) + " - " + moment.unix(params.until).format("DD MMM YYYY");
		params[params.span + "Active"] = true;
		
		// Custom fields
		params.startstring = moment.unix(params.since).format("DD-MM-YYYY");
		params.endstring = moment.unix(params.until).format("DD-MM-YYYY");
		
		return params;
	},
	
	'addperiod' : function ()
	{
		this.period += 1;
		this.render();
	},
	
	'subtractperiod' : function()
	{
		this.period -= 1;
		this.render();
	},
	
	'changespan' : function()
	{
		this.period = 0;
		this.render();
	},
	
	'changecustom' : function()
	{
		this.start = moment(this.$el.find('#start').val(), "DD-MM-YYYY");
		this.end = moment(this.$el.find('#end').val(), "DD-MM-YYYY");
		
		this.render();
	},
	
	'filterparameters' : function() {
 
		// Get time span
		var span = this.$el.find('.stats-header select').val();
		if(span) this.timespan = span;
	
		if (this.timespan == "now") {	this.period = 0; }
		if (this.timespan == "week") {	this.start = moment().zone(0).startOf('isoweek');	this.end = moment().zone(0).endOf('isoweek'); }
		if (this.timespan == "month") {	this.start = moment().zone(0).startOf('month');	this.end = moment().zone(0).endOf('month'); }
		if (this.timespan == "year") {	this.start = moment().zone(0).startOf('year');	this.end = moment().zone(0).endOf('year'); }

		if (this.timespan == "quarter")
		{	//Still not updated with .zone(0)
			var months = (this.period + moment().quarter()) *3;
			this.start = moment().startOf('year').add('months', months -3);
			this.end = moment().startOf('year').add('months', months -1).endOf('month');
			
		} else if(this.timespan != "custom")
		{
			if(this.period > 0) { this.start.add(this.timespan +"s", this.period);						this.end.add(this.timespan +"s", this.period); }
			if(this.period < 0) { this.start.subtract(this.timespan +"s", Math.abs(this.period));	this.end.subtract(this.timespan +"s", Math.abs(this.period)); }
		}
		
		return {since: this.start.unix(), until: this.end.unix(), span: this.timespan, period: this.period};
	},
	
	'finish' : function()
	{
	},

	'updatenetwork' : function(e){
		var report = e.currentTarget.dataset.report;
		
	}
});