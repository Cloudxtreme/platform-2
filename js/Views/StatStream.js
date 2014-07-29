Cloudwalkers.Views.StatStream = Cloudwalkers.Views.Statistics.extend({
	
	
	'networkspecific' : {
		'typeA' : { 
			'facebook' : {filterfunc: "age", chart: "PieChart", title: "By Age"},
			'twitter' : {filterfunc: "follow", chart: "PieChart", title: "By Type"},
			'linkedin' : {filterfunc: "follow", chart: "PieChart", title: "By Type"},
			'youtube' : {filterfunc: "follow", chart: "PieChart", title: "By Type"}
		},
		'typeB' : { 
			'facebook' : {filterfunc: "gender", chart: "PieChart", title: "By gender"},
			'twitter' : {filterfunc: "nodata", chart: "PieChart", title: "No data"},
			'youtube' : {filterfunc: "nodata", chart: "PieChart", title: "No data"},
			'linkedin' : {filterfunc: "nodata", chart: "PieChart", title: "No data"},
		},
	},
	
	'widgets' : [

		// ** Network context widgets **
		{widget: "StatSummary", data: {columnviews: ["contacts-network", "score-trending-network", "outgoing-network", "besttime"]}, span: 12},

		{widget: "TitleSeparator", data: {title: "Contacts info"}},
		{widget: "Chart", data: {filterfunc: "contact-evolution-network", chart: "LineChart", title: "Contacts Evolution"}, span : 6},
		{widget: "Chart", data: 'typeA', span : 3},
		{widget: "Chart", data: 'typeB', span : 3},

		{widget: "TitleSeparator", data: {title: "Network info"}},
		{widget: "Info", data: {title: "New impressions", filterfunc: "page-views-network"}, span: 3},
		{widget: "Info", data: {title: "New shares", filterfunc: "shares"}, span: 3},
		{widget: "Info", data: {title: "New posts", filterfunc: "posts"}, span: 3},
		{widget: "Info", data: {title: "New direct messages", filterfunc: "dms"}, span: 3},

		{widget: "TitleSeparator", data: {title: "Messages info"}},
		{widget: "TrendingMessage", data: {title: "Top rated comment"}, span: 12},
		{widget: "Chart", data: {filterfunc: "message-evolution-network", chart: "LineChart", title: "Messages Evolution"}, span : 6},
		{widget: "HeatCalendar", data: {filterfunc: "activity", title: "Activity Calendar"}, span: 6},

		//{widget: "TitleSeparator", data: {title: "Geo Graphics"}, networks : ['facebook']},
		{widget: "Chart", data: {filterfunc: "geo", type: "dots", chart: "GeoChart", title: "Countries", connect : true}, networks : ['facebook'], span: 8},
		{widget: "CompoundChart", span: 4, data : { template: "2row", chartdata: [ 
			{widget: "Chart", data: {filterfunc: "regional", chart: "PieChart", title: "Countries"}, connect: 'regional'},
			{widget: "Chart", data: {filterfunc: "cities", chart: "PieChart", title: "Cities"}}
			]}, networks : ['facebook']
		},
	],
	
	'initialize' : function(options)
	{
		if (options) $.extend(this, options);
		
		// Test
		//console.log("the streamid was:", this.streamid)
		this.streamid = Number(this.streamid);

		// Check if collection exists
		if(!this.model.statistics) this.model.statistics = new Cloudwalkers.Collections.Statistics();
		
		// Which collection to focus on
		this.collection = this.model.statistics;
		
		// Listen to model
		this.listenTo(this.collection, 'request', this.showloading);
		this.listenTo(this.collection, 'ready', this.hideloading);
		this.listenToOnce(this.collection, 'sync', this.fillcharts);
		this.listenTo(Cloudwalkers.RootView, "resize", this.resize);
		
		this.cleancollection();

		google.load('visualization', '1',  {'callback': function () { this.gloaded = true; }.bind(this), 'packages':['corechart']});
		
	}


});