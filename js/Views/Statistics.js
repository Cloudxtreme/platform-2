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
		'change .stats-header select': 'changespan'
	},
	
	'widgets' : [
		{widget: "StatSummary", data: {columnviews: ["contacts", "score-trending", "outgoing", "coworkers"]}, span: 12},
		{widget: "Chart", data: {chart: "PolarArea", title: "Contacts"}, span: 6},
		{widget: "Chart", data: {chart: "Doughnut", title: "By Age"}, span: 3},
		{widget: "Chart", data: {chart: "Doughnut", title: "By Gender"}, span: 3},
		
		{widget: "Info", data: {title: "Contact Evolution"}, span: 3},
		{widget: "Info", data: {title: "Post Activity"}, span: 3},
		{widget: "Info", data: {title: "Activity?"}, span: 3},
		{widget: "Info", data: {title: "Page Views?"}, span: 3},
		
		{widget: "Chart", data: {chart: "PolarArea", title: "Regional Popularity"}, span: 6},
		{widget: "Legenda", data: {}, span: 3},
		{widget: "Combo", data: { widgets: [
			{widget: "Chart", data: {chart: "Doughnut", title: "Country"}, span: 12},
			{widget: "Chart", data: {chart: "Doughnut", title: "By Gender"}, span: 12},
		]}, span: 3},
		
		{widget: "Chart", data: {chart: "Line", title: "Best Time to Post"}, span: 6},
		{widget: "HeatCalendar", data: {title: "Activity Calendar"}, span: 6},
		
	],
	
	'initialize' : function(options)
	{
		if (options) $.extend(this, options);
		
		// !Test
		// this.model = Cloudwalkers.Session.getStream(264);
		
		// Check if collection exists
		if(!this.model.statistics) this.model.statistics = new Cloudwalkers.Collections.Statistics();
		
		// Which collection to focus on
		this.collection = this.model.statistics;
		
		// Listen to model
		this.listenTo(this.collection, 'request', this.showloading);
		this.listenTo(this.collection, 'sync', this.hideloading);
		
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
		
		// Widgets
		for(n in this.widgets)
		{
			this.widgets[n].data.model = this.model;
			
			var view = new Cloudwalkers.Views.Widgets[this.widgets[n].widget] (this.widgets[n].data);
			
			//console.log("widget:", view, this.widgets[n].span)
			this.views.push(view);
			this.appendWidget(view, this.widgets[n].span);
		}
		
		// Load statistics
		this.collection.touch(this.model, this.filterparameters());

		return this;
	},
	
	'timemanager' : function ()
	{
		// Get parameters
		var params = this.filterparameters();
		
		var start = moment.unix(params.start);
		var startformat = (start.date() > 24 || params.span == "quarter")? (start.month() == 11? "DD MMM YYYY":"DD MMM"): "DD";
		
		params.periodstring = (!this.period && params.span != "custom")? "this ": (this.period==-1? "last ": "");
		params.timeview = start.format(startformat) + " - " + moment.unix(params.end).format("DD MMM YYYY");
		params[params.span + "Active"] = true;
		
		// Custom fields
		params.startstring = moment.unix(params.start).format("DD-MM-YYYY");
		params.endstring = moment.unix(params.end).format("DD-MM-YYYY");
		
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
		
		return {start: this.start.unix(), end: this.end.unix(), span: this.timespan, period: this.period};
	},
	
	'finish' : function()
	{
	}
	
});

/**
 *	Moment.js
 *	extented functions
 */



/*Cloudwalkers.Views.Reports = Cloudwalkers.Views.Widgets.WidgetContainer.extend({

	'navclass' : 'reports',
	'title' : 'Report',

	'datepicker' : null,

	'initializeWidgets' : function ()
	{

		this.title = this.title + " " + this.options.stream.get("customname");
		
		this.datepicker = new Cloudwalkers.Views.Widgets.Datepicker ();

		// Hide datapicker for now.
		// this.addWidget (this.datepicker, true);

		if (typeof (this.options.stream) == 'undefined' || !this.options.stream)
		{
			var streams = Cloudwalkers.Session.getStreams ();
			var self = this;

			for (var i = 0; i < streams.length; i ++)
			{
				if (streams[i].get ('statistics'))
				{
					
					this.addStreamWidgets (streams[i]);
				}
			}
		}

		else this.addStreamWidgets (this.options.stream);
	},

	'addStreamWidgets' : function (stream)
	{
		
		var self = this;
		$.ajax 
		(
			CONFIG_BASE_URL + 'json/stream/' + stream.get ('id') + '/statistics',
			{
				'success' : function (data)
				{
					
					if (data.statistics.length > 0)
					{
						// Title
						//var title = new Cloudwalkers.Views.Widgets.Title ({ 'title' : stream.attributes.customname });
						//self.add (title);

						// We're going to combine all plain statistics in a special, combined widget.
						var plainstatistics = [];
						var other = [];

						for (var j = 0; j < data.statistics.length; j ++)
						{
							if (data.statistics[j].type == 'time')
							{
								plainstatistics.push (data.statistics[j]);
							}

							else
							{
								other.push (data.statistics[j]);
							}
						}

						// Add combined statistic (on top)
						self.addCombinedWidget (stream.attributes, plainstatistics);

						// Add all others
						for (var i = 0; i < other.length; i ++)
						{
							self.addReportWidget (stream.attributes, other[i]);
						}
					}
				}
			}
		);
	},

	'addCombinedWidget' : function (stream, reportsdata)
	{
			
		function addReport (repdat)
		{
			var report;
			
			reportsdata[i].stream = stream;
			report = new Cloudwalkers.Models.Report (repdat);

			reports.push (report);
		}

		var self = this;
		var reports = [];

		for (var i = 0; i < reportsdata.length; i ++)
		{
			addReport (reportsdata[i]);
		}

		var widget = new Cloudwalkers.Views.Widgets.CombinedStatistics ({ 'reports' : reports, 'stream' : stream });

		widget.color = stream.network.icon + '-color';
		widget.network = stream.network;
		
		this.add (widget);
	},

	'addReportWidget' : function (stream, reportdata)
	{
		var self = this;

		//var dataurl = CONFIG_BASE_URL + 'json/' + statdata.url;

		reportdata.stream = stream;
		
		var report = new Cloudwalkers.Models.Report (reportdata);

		var widget = report.getWidget ();

		var daterange = self.datepicker.getDateRange ();
		report.setDateRange (daterange[0], daterange[1]);

		widget.color = stream.network.icon + '-color';
		widget.network = stream.network;
		widget.showLink = false;
		widget.showStreamName = false;

		self.datepicker.on ('date:change', function (start, end)
		{
			widget.getDataset ().setDateRange (start, end);
		});
		
		// Check widget size
		this.add (widget);
	}
});*/