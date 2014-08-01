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
		'click #now': 'now',
		'click #show': 'changecustom',
		'change .stats-header select.networks': 'changestream',
		'change .stats-header select.time': 'changespan',
		'click .dashboard-stat' : 'updatenetwork'
	},
	
	'widgets' : [
		{widget: "StatSummary", data: {columnviews: ["contacts", "score-trending", "outgoing", "coworkers"]}, span: 12},

		{widget: "TitleSeparator", data: {translation:{ 'title': 'contacts_info'}}},
		{widget: "Chart", data: {filterfunc: "contacts", chart: "PieChart", translation:{ 'title': 'contacts'}, display: "divided"}, span: 6},
		{widget: "CompoundChart", span: 6, data : { template: "2col1row", chartdata: [ 
			{widget: "Chart", data: {filterfunc: "age", chart: "PieChart", translation:{ 'title': 'by_age'}}},
			{widget: "Chart", data: {filterfunc: "gender", chart: "PieChart", translation:{ 'title': 'by_gender'}}},
			{widget: "Chart", data: {filterfunc: "contact-evolution", chart: "LineChart", translation:{ 'title': 'contacts_evolution'}}}
			]}
		},
		//{widget: "Chart", data: {filterfunc: "age", chart: "PieChart", title: "By Age"}, span: 3},
		//{widget: "Chart", data: {filterfunc: "gender", chart: "PieChart", title: "By Gender"}, span: 3},
		
		{widget: "TitleSeparator", data: {translation:{ 'title': 'new_this'}}},
		{widget: "Info", data: {translation:{ 'title': 'contact_evolution'}, filterfunc: "contact-evolution"}, span: 3},
		{widget: "Info", data: {translation:{ 'title': 'post_activity'}, filterfunc: "post-activity"}, span: 3},
		{widget: "Info", data: {title: "Activity?", filterfunc: "activity"}, span: 3},
		{widget: "Info", data: {title: "Page Views?", filterfunc: "page-views"}, span: 3},

		{widget: "TitleSeparator", data: {translation:{ 'title': 'messages_info'}}},
		{widget: "TrendingMessage", data: {translation:{ 'title': 'top_rated_comment'}}, span: 12},
		{widget: "BestTimeToPost", data: {filterfunc: "besttime", chart: "LineChart", translation:{ 'title': 'best_time_to_post'}}, span: 4},
		{widget: "Chart", data: {filterfunc: "message-evolution", chart: "LineChart", translation:{ 'title': 'messages_evolution'}}, span: 4},
		{widget: "HeatCalendar", data: {filterfunc: "activity", translation:{ 'title': 'activity_calendar'}}, span: 4},

		{widget: "TitleSeparator", data: {translation:{ 'title': 'geo_graphics'}}},
		{widget: "Chart", data: {filterfunc: "geo", type: "dots", chart: "GeoChart", translation:{ 'title': 'countries'}, connect : true}, span: 8},
		{widget: "CompoundChart", span: 4, data : { template: "2row", chartdata: [ 
			{widget: "Chart", data: {filterfunc: "regional", chart: "PieChart", translation:{ 'title': 'countries'}}, connect: 'regional'},
			{widget: "Chart", data: {filterfunc: "cities", chart: "PieChart", translation:{ 'title': 'cities'}}}
			]}
		}
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
		
		this.cleancollection();
		
		google.load('visualization', '1',  {'callback': function () { this.render();}.bind(this), 'packages':['corechart']});
		
	},
	
	'render' : function()
	{			
		var params = this.timemanager();
		params.streams = [];
		
		// Select streams
		params.streams = this.model.streams.where({ 'statistics': 1 }).map(function(stream)
		{
			stream.attributes.selected = (stream.id == this.streamid);
			return stream.attributes;
		}.bind(this));

		//Mustache Translate Render
		this.mustacheTranslateRender(params);
		
		// Build Pageview
		this.$el.html (Mustache.render (Templates.statsview, params));
		this.$container = this.$el.find("#widgetcontainer").eq(0);
		
		// Chosen
		this.$el.find("select").chosen({width: "200px", disable_search_threshold: 10, inherit_select_classes: true});
		
		// Date picker
		if (this.timespan == "custom")
			this.$el.find('#start, #end').datepicker({format: 'dd-mm-yyyy'});

		if(this.period == 0)
			this.$el.find('#add').attr("disabled", true);

		// Load statistics
		this.collection.touch(this.model, this.filterparameters());

		
		return this;
	
	},

	'fillcharts' : function()
	{	
		if(this.collection.latest() && this.collection.latest().get("streams"))
			this.hideloading();
		else
			this.listenToOnce(this.collection, 'sync', this.hideloading);

		// clean if time toggle
		this.cleanviews();

		for(n in this.widgets)
		{	
			if(this.widgets[n].data.translation){
				this.translateWidgets(this.widgets[n].data);
			} else if(this.widgets[n].data.chartdata){
				for(i in this.widgets[n].data.chartdata){
					this.translateWidgets(this.widgets[n].data.chartdata[i].data)
				}
			}
				

			var streamid = this.streamid || false;
			
			if(streamid){

				var token = Cloudwalkers.Session.getStream(streamid).get("network").token;
				// Network specific charts
				if(this.widgets[n].networks && this.widgets[n].networks != token)	continue;
			}

			if(_.isString(this.widgets[n].data))
				this.widgets[n].data = this.networkspecific[this.widgets[n].data][token];

			this.widgets[n].data.network = streamid;
			this.widgets[n].data.model = this.model;
			this.widgets[n].data.parent = this;
			this.widgets[n].data.visualization = google.visualization;
			this.widgets[n].data.timespan = {since : this.start.unix(), to : this.end.unix()}
			this.widgets[n].data.span = this.timespan;

			//pass regional data
			//_.isString(this.widgets[n].data.connect) ? this.widgets[n].data.connect = this.connect : false;
			translate = {}

			
			translate.new_this = this.translateString("new_this");
			translate.top_rated_comment = this.translateString("top_rated_comment");
			translate.messages_evolution = this.translateString("messages_evolution");
			translate.activity_calendar = this.translateString("activity_calendar");

			if(this.timespan == 'week'){
				translate.new_this_n = this.translateString("new_this");
			}else{
				translate.new_this_n = this.translateString("new_this_m");
			}

			if(this.widgets[n].data.title == translate.new_this)
				this.widgets[n].data.title = translate.new_this_n+" "+this.translateString(this.timespan);
			

			if(this.widgets[n].data.title == translate.top_rated_comment){
				if(this.timespan == 'quarter')		this.widgets[n].span = 8;
				else if(this.timespan == 'year')	this.widgets[n].span = 8;
				else								this.widgets[n].span = 12;
			}

			if(this.widgets[n].data.title == translate.messages_evolution){
				if(this.timespan == 'quarter')		this.widgets[n].span = 6;
				else if(this.timespan == 'year')	this.widgets[n].span = 12;
				else								this.widgets[n].span = 4;
			}

			if(this.widgets[n].data.title == translate.activity_calendar){
				if(this.timespan == translate.this)	quarter.widgets[n].span = 6;
				else if(this.timespan == 'year'){
					this.widgets[n].span = 12;
					this.widgets[n].data.bigdata = true;
				}
				else{
					this.widgets[n].span = 4;
					this.widgets[n].data.bigdata = false;
				}							
			}
			
			var view = new Cloudwalkers.Views.Widgets[this.widgets[n].widget] (this.widgets[n].data);
			//this.widgets[n].data.connect == true ? this.connect = view : false;
			
			this.views.push(view);
			
			this.appendWidget(view, this.widgets[n].span);
			
		}

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
		
		// Language Hack (invert word order)
		if(Cloudwalkers.Session.user.attributes.locale == "pt_PT"){
			params.fullperiod = this.translateString(params.span) + " " + this.translateString(params.periodstring);
		} else {
			params.fullperiod = this.translateString(params.periodstring) + " " + this.translateString(params.span);
		}

		return params;
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
		this.$el.find('.period-buttons .btn').attr("disabled", false);

		this.$el.find('select').prop('disabled', false).trigger("chosen:updated");

		this.listenToOnce(this, 'change:period', this.render);
	},

	'now' : function()
	{
		this.cleancollection();
		this.period = 0;
		
		this.trigger('change:period');
	},
	
	'addperiod' : function (e)
	{	
		var state = $(e.target).attr('disabled');

		if(this.period >= 0 || state == 'disabled')	return;
		
		this.cleancollection();
		this.period += 1;
		
		this.trigger('change:period');
	},
	
	'subtractperiod' : function(e)
	{
		var state = $(e.target).attr('disabled');

		if(state == 'disabled')	return;
		
		this.cleancollection();
		this.period -= 1;
		
		this.trigger('change:period');
	},
	
	'changestream' : function()
	{	
		var streamid = Number(this.$el.find("select.networks").val());
		
		Cloudwalkers.Router.Instance.navigate( streamid? "#statistics/" + streamid: "#statistics", {trigger: true}); 
	},
	
	'changespan' : function()
	{
		this.cleancollection();

		var timespan = this.$el.find("select.time").val();
		this.timespan = timespan;

		this.trigger('change:period');
	},
	
	'changecustom' : function()
	{
		this.cleancollection();

		this.start = moment(this.$el.find('#start').val(), "DD-MM-YYYY");
		this.end = moment(this.$el.find('#end').val(), "DD-MM-YYYY");
		
		this.trigger('change:period');
	},
	
	'filterparameters' : function() {
 
		// Get time span
		//var span = this.$el.find('.stats-header select').val();
		//if(span) this.timespan = span;
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
		
	},

	'cleancollection' : function()
	{	
		this.listenToOnce(this.collection, 'sync', this.fillcharts);
		this.collection.reset();
	},

	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
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

	'mustacheTranslateRender' : function(translatelocation)
	{
		// Translate array
		this.original  = [
			"week",
			"month",
			"quarter",
			"year",
			"custom",
			"time_spans",
			"all_networks",
			"now",
			"show"
		];

		this.translated = [];

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}
	}
});