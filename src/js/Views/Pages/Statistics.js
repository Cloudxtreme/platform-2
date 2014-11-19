/**
 *	Statistics
 *
 *	Statistics view listens to statistics endpoint call.
 *	2 sync responses are available
 *
 *	sync:data			response with data
 *	sync:noresults 		empty response
 */

define(
	['Views/Pages/Pageview', 'mustache', 'Collections/Statistics', 'Views/Panels/Statistics/EmptyStatisticsData',
	 'Views/Panels/Statistics/StatSummary', 'Views/Panels/Statistics/TitleSeparator','Views/Panels/Statistics/Chart', 'Views/Panels/Statistics/CompoundChart', 'Views/Panels/Statistics/Info',
	 'Views/Panels/Statistics/TrendingMessage', 'Views/Panels/Statistics/BestTimeToPost', 'Views/Panels/Statistics/HeatCalendar',      
	 ],

	function (Pageview, Mustache, Statistics, EmptyStatisticsWidget, StatSummary, TitleSeparator, Chart, CompoundChart, Info,
			  TrendingMessage, BestTimeToPost, HeatCalendar)
	{
		var StatisticsView = Pageview.extend({
			
			id : "statistics",
			start : 0,
			end: 0,
			timespan : "default",
			period : 0,
			custom : false,
			views : [],
			
			events : {
				'remove': 'destroy',
				'click #add': 'addperiod',
				'click #subtract': 'subtractperiod',
				'click #subtractempty': 'subtractempty',
				'click #addempty': 'addempty',
				'click #showreports': 'showreports',
				'click #now': 'now',
				'click #show': 'changecustom',
				'change .stats-header select.networks': 'changestream',
				'change .stats-header select.time': 'changespan',
				'click .dashboard-stat' : 'updatenetwork'
			},
			
			widgets : [
				{widget: "StatSummary", data: {columnviews: ["contacts", "score-trending", "outgoing", "coworkers"]}, span: 12},

				{widget: "TitleSeparator", data: {title: 'Contacts Info'}},
				{widget: "Chart", data: {filterfunc: "contacts", chart: "PieChart", title: 'Contacts', display: "divided"}, span: [12,4,6,6]},
				{widget: "CompoundChart", span: [12,8,6,6], data :
				{	template: "2col1row", chartdata: [ 
						{widget: "Chart", data: {filterfunc: "age", chart: "PieChart", title: 'By Age'}},
						{widget: "Chart", data: {filterfunc: "gender", chart: "PieChart", title: 'By Gender'}},
						{widget: "Chart", data: {filterfunc: "contact-evolution", chart: "LineChart", title: 'Contacts evolution'}}
					]
				}},
				
				{widget: "TitleSeparator", data: {title: 'New this'}},
				{widget: "Info", data: {title: 'Contact Evolution', filterfunc: "contact-evolution"}, span: [12,6,3,3]},
				{widget: "Info", data: {title: 'Post Activity', filterfunc: "post-activity"}, span: [12,6,3,3]},
				{widget: "Info", data: {title: "Activity?", filterfunc: "activity"}, span: [12,6,3,3]},
				{widget: "Info", data: {title: "Page Views?", filterfunc: "page-views"}, span: [12,6,3,3]},

				{widget: "TitleSeparator", data: {title: 'Messages info'}},
				{widget: "TrendingMessage", data: {title: 'Most popular message'}, span: 12},
				{widget: "BestTimeToPost", data: {filterfunc: "besttime", chart: "LineChart", title: 'Best time to post'}, span: [12,6,6,4]},
				{widget: "Chart", data: {filterfunc: "message-evolution", chart: "LineChart", title: 'Messages evolution'}, span: [12,6,6,4]},
				{widget: "HeatCalendar", data: {filterfunc: "activity", title: 'Activity calendar'}, span: [12,6,6,4]},

				{widget: "TitleSeparator", data: {title: 'Geo Graphics'}},
				{widget: "Chart", data: {filterfunc: "geo", type: "dots", chart: "GeoChart", title: 'Countries'}, span: [12,12,8,8]},
				{widget: "CompoundChart", span: [12,12,4,4], data :
				{	template: "2row", chartdata: [ 
						{widget: "Chart", data: {filterfunc: "regional", chart: "PieChart", title: 'Countries'}},
						{widget: "Chart", data: {filterfunc: "cities", chart: "PieChart", title: 'Cities'}}
					]
				}}
			],
			
			initialize : function(options)
			{	
				if (options) $.extend(this, options);

				this.collection = new Statistics();
				
				// Listen to model
				this.listenTo(this.collection, 'request', this.showloading);
				this.listenTo(this.collection, 'seed', this.fillcharts);
				this.listenTo(this.collection, 'sync:data', this.hideloading);
				this.listenTo(this.collection, 'sync:noresults', this.showempty);
				
				this.streamid = parseInt(this.streamid)
			},
			
			render : function()
			{			
				// Time attributes
				var params = this.timemanager();
				
				// Select streams
				params.streams = Cloudwalkers.Session.getStreams().where ({statistics: 1}).map (function (stream)
				{
					stream.attributes.selected = (stream.id == this.streamid);
					return stream.attributes;
					
				}.bind(this));
				
				// Build Pageview
				this.$el.html (Mustache.render (Templates.statsview, params));
				this.$container = this.$el.find("#widgetcontainer").eq(0);
				
				// Chosen
				this.$el.find("select").chosen({width: "200px", disable_search_threshold: 10, inherit_select_classes: true});
				
				// Date picker
				if (this.timespan == "custom")
					this.$el.find('#start, #end').datepicker({format: 'dd-mm-yyyy'});

				if(this.period === 0)
					this.$el.find('#add').attr("disabled", true);

				// Load Google stuff
				// Load statistics
				require(
					['goog!visualization,1,packages:[corechart,geochart]', 'goog!search,1'],
					function () {

						google.load('visualization', '1', { 'callback': this.request.bind (this), 'packages':['corechart']});	

					}.bind(this));

				return this;
			},

			writeui : function()
			{
				var params = this.timemanager();

				this.$el.find('.stats-header-timeview').eq(0)
					.html('<strong>'+ params.fullperiod +': </strong>'+ params.timeview)
			},
			
			request : function (period)
			{	
				if(period && this.timespan == 'default')
					this.timespan = 'week';

				//this.fillcharts ();
				this.writeui();
				this.collection.touch (this.filterparameters ());

				// Saving the period
				this.currentperiod = period;
			},

			fillcharts : function (list)
			{
				//Temporary hack to map widgets
				var widgetmap = {
					'Chart' : Chart,
					'StatSummary' : StatSummary,
					'TitleSeparator' : TitleSeparator,
					'CompoundChart' : CompoundChart,
					'Info' : Info,
					'TrendingMessage' : TrendingMessage,
					'BestTimeToPost' : BestTimeToPost,
					'HeatCalendar' : HeatCalendar
				}

				if (list && !list.length) return this.showempty();		

				this.cleanviews();
			
				// Iterate widgets
				this.widgets.forEach (function (widget)
				{
					if(widget.widget == 'clear')
						this.resetwrapping();

					// Stream based data	
					if (this.streamid && this.streamdata(widget))
						widget.data = this.streamdata(widget);

					else if(this.streamid)
						return;

					widget.data.parentview = this;
					widget.data.timespan = {
						since : this.start.unix(), 
						to : this.end.unix()
					}

					var view = new widgetmap[widget.widget] (widget.data);
					
					this.views.push (view);
					
					this.appendWidget (view, widget.span);
					
				}.bind(this));

			},
			
			timemanager : function ()
			{
				// Get parameters
				var params = this.filterparameters();
				
				var start = moment.unix(params.since).zone(0);
				var startformat = (start.date() > 24 || params.span == "quarter")? (start.month() == 11? "DD MMM YYYY":"DD MMM"): "DD";
				
				if(this.timespan == 'default')
				{
					params.periodstring = 'Last 7 days';
					params.span = "";
				}
				else
					params.periodstring = (!this.period && params.span != "custom")? "this ": (this.period==-1? "last ": "");

				params.timeview = start.format(startformat) + " - " + moment.unix(params.until).zone(0).format("DD MMM YYYY");
				params[params.span + "Active"] = true;
				
				// Custom fields
				params.startstring = moment.unix(params.since).zone(0).format("DD-MM-YYYY");
				params.endstring = moment.unix(params.until).zone(0).format("DD-MM-YYYY");
				
				// BIG NO-NO
				// Language Hack (invert word order)
				if(Cloudwalkers.Session.user.attributes.locale == "pt_PT"){
					params.fullperiod = trans(params.span) + " " + trans(params.periodstring);
				} else {
					params.fullperiod = trans(params.periodstring) + " " + trans(params.span);
				}
				
				return params;
			},

			showloading : function ()
			{	
				this.$el.addClass("loading");
			},
			
			hideloading : function ()
			{
				this.$el.removeClass("loading");
				this.$el.find('.period-buttons .btn').attr("disabled", false);

				this.$el.find('select').prop('disabled', false).trigger("chosen:updated");

				this.listenToOnce(this, 'change:period', this.request);

				// Rendering charts after span change
				if(this.currentperiod)
					this.period = this.currentperiod;
			},
			
			showempty : function ()
			{	
				this.cleanviews();
				this.hideloading();

				var view = new EmptyStatisticsWidget ({timeparams: this.timeparams, stream: this.streamid});

				this.views.push (view);
				this.appendWidget (view, 8, null, 2);
			},

			now : function()
			{
				this.period = 0;
				
				this.trigger('change:period', this.period);
			},
			
			addperiod : function (e)
			{	
				var state = $(e.target).attr('disabled');

				if(this.period >= 0 || state == 'disabled')	return;
				
				this.period += 1;
				
				this.trigger('change:period', this.period);
			},
			
			subtractperiod : function(e)
			{
				var state = $(e.target).attr('disabled');

				if(state == 'disabled')	return;

				this.period -= 1;

				this.trigger('change:period', this.period);
			},

			subtractempty : function()
			{
				this.period -= 1;	
				this.trigger('change:period', this.period);
			},

			addempty : function()
			{
				this.period += 1;	
				this.trigger('change:period', this.period);
			},

			showreports : function()
			{	
				var streamid = Number(this.$el.find("select.networks").val());

				if(!streamid)
					streamid = Cloudwalkers.Session.getStreams().where ({statistics: 1})[0].id;

				Cloudwalkers.Router.navigate( streamid? "#reports/" + streamid: "#reports", {trigger: true}); 
			},
			
			changestream : function()
			{	
				var streamid = Number(this.$el.find("select.networks").val());
				
				Cloudwalkers.Router.navigate( streamid? "#statistics/" + streamid: "#statistics", {trigger: true}); 
			},
			
			changespan : function()
			{
				var timespan = this.$el.find("select.time").val();
				this.timespan = timespan;

				this.trigger('change:period');
			},
			
			changecustom : function()
			{
				this.start = moment(this.$el.find('#start').val(), "DD-MM-YYYY");
				this.end = moment(this.$el.find('#end').val(), "DD-MM-YYYY");
				
				this.trigger('change:period');
			},
			
			filterparameters : function() {
		 
				// Get time span

				//Default time span == last 7 days
				if (this.timespan == "default") { 	this.start = moment().subtract(7, 'days').zone(0).endOf('day');	this.end = moment().zone(0).endOf('day'); }		

				if (this.timespan == "now") 	{	this.period = 0; }

				if (this.timespan == "week") 	{	this.start = moment().zone(0).startOf('isoweek');	this.end = moment().zone(0).endOf('isoweek'); }
				if (this.timespan == "month") 	{	this.start = moment().zone(0).startOf('month');		this.end = moment().zone(0).endOf('month'); }
				if (this.timespan == "year") 	{	this.start = moment().zone(0).startOf('year');		this.end = moment().zone(0).endOf('year'); }

				if (this.timespan == "quarter")
				{	
					//Still not updated with .zone(0)
					var months = (this.period + moment().quarter()) *3;
					this.start = moment().startOf('year').add('months', months -3);
					this.end = moment().startOf('year').add('months', months -1).endOf('month');
					
				} else if(this.timespan != "custom")
				{
					if(this.period > 0) { this.start.add(this.timespan +"s", this.period);						this.end.add(this.timespan +"s", this.period); }
					if(this.period < 0) { this.start.subtract(this.timespan +"s", Math.abs(this.period));	this.end.subtract(this.timespan +"s", Math.abs(this.period)); }
				}

				//Show now
				if(this.period !== 0)
					this.$el.find('#now').eq(0).removeClass('hidden');
				else
					this.$el.find('#now').eq(0).addClass('hidden');

				// For the empty data check
				this.timeparams = {since: this.start.unix(), until: this.end.unix(), span: this.timespan};

				return {since: this.start.unix(), until: this.end.unix(), span: this.timespan, period: this.period, reset: true};
			},
			
			finish : function()
			{
			},

			updatenetwork : function(e)
			{
				var report = e.currentTarget.dataset.report;
			}
		});

		return StatisticsView;
	}
);