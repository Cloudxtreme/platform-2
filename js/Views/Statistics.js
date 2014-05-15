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
		'change .stats-header select': 'changespan',
		'click .dashboard-stat' : 'updatenetwork'
	},
	
	'widgets' : [
		{widget: "StatSummary", data: {columnviews: ["contacts", "score-trending", "outgoing", "coworkers"]}, span: 12},
		{widget: "Chart", data: {filterfunc: "contacts", chart: "PieChart", title: "Contacts", display: "divided"}, span: 6},
		{widget: "Chart", data: {filterfunc: "age", chart: "PieChart", title: "By Age"}, span: 3},
		{widget: "Chart", data: {filterfunc: "gender", chart: "PieChart", title: "By Gender"}, span: 3},
		
		{widget: "Info", data: {title: "Contact Evolution", filterfunc: "contact-evolution"}, span: 3},
		{widget: "Info", data: {title: "Post Activity", filterfunc: "post-activity"}, span: 3},
		{widget: "Info", data: {title: "Activity?", filterfunc: "activity"}, span: 3},
		{widget: "Info", data: {title: "Page Views?", filterfunc: "page-views"}, span: 3},
		
		{widget: "Chart", data: {filterfunc: "regional", chart: "PieChart", title: "Regional Popularity", connect: true}, span: 6},
		{widget: "Chart", data: {filterfunc: "networks", chart: "PieChart", title: "Countries", connect: 'regional'}, span: 3},
		{widget: "Chart", data: {filterfunc: "cities", chart: "PieChart", title: "Cities", connect: 'regional'}, span: 3},
		
		{widget: "Chart", data: {filterfunc: "besttime", chart: "LineChart", title: "Best Time to Post"}, span: 6},
		{widget: "HeatCalendar", data: {filterfunc: "activity", title: "Activity Calendar"}, span: 6},
		//{widget: "Chart", data: {filterfunc: "activity", chart: "Calendar", title: "Activity Calendar"}, span: 6}
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"facebook", icon: "facebook", type:"contacts"}, span: 12},
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"facebook", icon: "facebook", type:"messages"}, span: 12},
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"facebook", icon: "facebook", type:"activities"}, span: 12},
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"facebook", icon: "facebook", type:"impressions"}, span: 12},
		
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"twitter", icon: "twitter", type:"contacts"}, span: 12},
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"twitter", icon: "twitter", type:"messages"}, span: 12},
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"twitter", icon: "twitter", type:"activities"}, span: 12},
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"twitter", icon: "twitter", type:"impressions"}, span: 12},

		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"youtube", icon: "youtube", type:"contacts"}, span: 12},
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"youtube", icon: "youtube", type:"messages"}, span: 12},
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"youtube", icon: "youtube", type:"activities"}, span: 12},
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"youtube", icon: "youtube", type:"impressions"}, span: 12},

		/*{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"mobile-phone", icon: "mobile-phone", type:"contacts"}, span: 12},
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"mobile-phone", icon: "mobile-phone", type:"messages"}, span: 12},
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"mobile-phone", icon: "mobile-phone", type:"activities"}, span: 12},
		{widget: "NewCombinedStatistics", data: {chart: "LineChart", network:"mobile-phone", icon: "mobile-phone", type:"impressions"}, span: 12}*/

		{widget: "NetworkStatistics", data: {chart: "LineChart", network:"facebook", icon: "facebook"}, span: 12},
		{widget: "NetworkStatistics", data: {chart: "LineChart", network:"twitter", icon: "twitter"}, span: 12},
		{widget: "NetworkStatistics", data: {chart: "LineChart", network:"youtube", icon: "youtube"}, span: 12},
		{widget: "NetworkStatistics", data: {chart: "LineChart", network:"mobile-phone", icon: "mobilhe-phone"}, span: 12},

		{widget: "Chart", data: {filterfunc: "geo", chart: "GeoChart", title: "Countries"}, span: 12},
		{widget: "Chart", data: {filterfunc: "geo", type: "dots", chart: "GeoChart", title: "Countries"}, span: 12},

		{widget: "TopComment", data: {title: "Top rated comment"}, span: 12}



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
		
		// Build Pageview
		this.$el.html (Mustache.render (Templates.statsview, this.timemanager()));
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
			this.widgets[n].data.model = this.model;
			this.widgets[n].data.parent = this;
			this.widgets[n].data.visualization = google.visualization;
			//pass regional data
			_.isString(this.widgets[n].data.connect) ? this.widgets[n].data.connect = this.connect : false;

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
		if (this.timespan == "week") {	this.start = moment().startOf('week');	this.end = moment().endOf('week'); }
		if (this.timespan == "month") {	this.start = moment().startOf('month');	this.end = moment().endOf('month'); }
		if (this.timespan == "year") {	this.start = moment().startOf('year');	this.end = moment().endOf('year'); }

		if (this.timespan == "quarter")
		{
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
		console.log(report)
	}
});