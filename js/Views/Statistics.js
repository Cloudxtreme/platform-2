Cloudwalkers.Views.Statistics = Cloudwalkers.Views.Pageview.extend({
	
	/**
	 *	Statistics
	 *
	 *	Statistics view listens to statistics endpoint call.
	 *	2 sync responses are available
	 *
	 *	sync:data			response with data
	 *	sync:noresults 		empty response
	 */
	
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
		'click #subtractempty': 'subtractempty',
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
		{widget: "CompoundChart", span: 6, data :
		{	template: "2col1row", chartdata: [ 
				{widget: "Chart", data: {filterfunc: "age", chart: "PieChart", translation:{ 'title': 'by_age'}}},
				{widget: "Chart", data: {filterfunc: "gender", chart: "PieChart", translation:{ 'title': 'by_gender'}}},
				{widget: "Chart", data: {filterfunc: "contact-evolution", chart: "LineChart", translation:{ 'title': 'contacts_evolution'}}}
			]
		}},
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
		{widget: "CompoundChart", span: 4, data :
		{	template: "2row", chartdata: [ 
				{widget: "Chart", data: {filterfunc: "regional", chart: "PieChart", translation:{ 'title': 'countries'}}, connect: 'regional'},
				{widget: "Chart", data: {filterfunc: "cities", chart: "PieChart", translation:{ 'title': 'cities'}}}
			]
		}}
	],
	
	'initialize' : function(options)
	{	
		if (options) $.extend(this, options);

		this.collection = new Cloudwalkers.Collections.Statistics();
		
		// Listen to model
		this.listenTo(this.collection, 'request', this.showloading);
		this.listenTo(this.collection, 'seed', this.fillcharts);
		this.listenTo(this.collection, 'sync:data', this.hideloading);
		this.listenTo(this.collection, 'sync:noresults', this.showempty);
		
		// General i18n
		translate =
		{
			new_this: this.translateString ("new_this"),
			new_this_m: this.translateString ("new_this_m"),
			top_rated_comment: this.translateString ("top_rated_comment"),
			messages_evolution: this.translateString ("messages_evolution"),
			activity_calendar: this.translateString ("activity_calendar")
		}

		this.streamid = parseInt(this.streamid)
	},
	
	'render' : function()
	{			
		// Time attributes
		var params = this.timemanager();
		
		// Select streams
		params.streams = Cloudwalkers.Session.getStreams().where ({statistics: 1}).map (function (stream)
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

		// Load Google stuff
		// Load statistics
		google.load('visualization', '1', { 'callback': this.request.bind (this), 'packages':['corechart']});	
		
		return this;
	},

	'writeui' : function(params)
	{
		if(!params)
			params = this.timemanager();

		this.$el.find('.stats-header-timeview').eq(0)
			.html('<strong>'+ params.fullperiod +': </strong>'+ params.timeview)

	},
	
	'request' : function (period)
	{
		//this.fillcharts ();
		this.writeui();
		this.collection.touch (this.filterparameters ());

		// Saving the period
		this.currentperiod = period;
	},

	'fillcharts' : function (list)
	{
		if (list && !list.length) return this.showempty();		
		else this.$container.html('');
	
		// Iterate widgets
		this.widgets.forEach (function (widget)
		{	
			// Translate
			if (widget.data.translation || widget.data.chartdata)
				this.translatechart (widget);

			// Stream based data	
			if (this.streamid)
				widget.data = this.streamdata (widget);
			
			widget.data.parentview = this;
			widget.data.timespan = {
				since : this.start.unix(), 
				to : this.end.unix()
			}

			var view = new Cloudwalkers.Views.Widgets[widget.widget] (widget.data);
			
			this.views.push (view);
			
			this.appendWidget (view, widget.span);
			
		}.bind(this));

	},
	
	/**
	 *	Translate chart
	 */
	translatechart : function (widget)
	{
		if (widget.data.translation) this.translateWidgets (widget.data);
		
		else if(widget.data.chartdata)
			
			for (var n in widget.data.chartdata) this.translateWidgets (widget.data.chartdata[n].data);
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
		
		// BIG NO-NO
		// Language Hack (invert word order)
		if(Cloudwalkers.Session.user.attributes.locale == "pt_PT"){
			params.fullperiod = this.translateString(params.span) + " " + this.translateString(params.periodstring);
		} else {
			params.fullperiod = this.translateString(params.periodstring) + " " + this.translateString(params.span);
		}

		return params;
	},

	'showloading' : function ()
	{	
		this.$el.addClass("loading");
	},
	
	'hideloading' : function ()
	{	
		this.$el.removeClass("loading");
		this.$el.find('.period-buttons .btn').attr("disabled", false);

		this.$el.find('select').prop('disabled', false).trigger("chosen:updated");

		this.listenToOnce(this, 'change:period', this.request);

		// Rendering charts after span change
		if(this.currentperiod)
			this.period = this.currentperiod;
	},
	
	'showempty' : function ()
	{	
		this.cleanviews();
		this.hideloading();

		var message = this.translateString ("empty_statistics_data") + '<br/><a id="subtractempty">'+ this.translateString ("show_last_statistics") +'</a>';
		var view = new Cloudwalkers.Views.Widgets.EmptyData ({message: message});

		this.appendWidget (view, 8, null, 2);
	},

	'now' : function()
	{
		this.period = 0;
		
		this.trigger('change:period', this.period);
	},
	
	'addperiod' : function (e)
	{	
		var state = $(e.target).attr('disabled');

		if(this.period >= 0 || state == 'disabled')	return;
		
		this.period += 1;
		
		this.trigger('change:period', this.period);
	},
	
	'subtractperiod' : function(e)
	{
		var state = $(e.target).attr('disabled');

		if(state == 'disabled')	return;

		this.period -= 1;

		this.trigger('change:period', this.period);
	},

	'subtractempty' : function()
	{
		this.period -= 1;	
		this.trigger('change:period', this.period);
	},
	
	'changestream' : function()
	{	
		var streamid = Number(this.$el.find("select.networks").val());
		
		Cloudwalkers.Router.Instance.navigate( streamid? "#statistics/" + streamid: "#statistics", {trigger: true}); 
	},
	
	'changespan' : function()
	{
		var timespan = this.$el.find("select.time").val();
		this.timespan = timespan;

		this.trigger('change:period');
	},
	
	'changecustom' : function()
	{
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
		
		return {since: this.start.unix(), until: this.end.unix(), span: this.timespan, period: this.period, reset: true};
	},
	
	'finish' : function()
	{
	},

	'updatenetwork' : function(e)
	{
		var report = e.currentTarget.dataset.report;
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