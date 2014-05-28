Cloudwalkers.Views.StatStream = Cloudwalkers.Views.Statistics.extend({
	
	
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
	],
	
	'initialize' : function(options)
	{
		if (options) $.extend(this, options);
		
		// Test
		console.log("the streamid:", this.streamid)

		// Check if collection exists
		if(!this.model.statistics) this.model.statistics = new Cloudwalkers.Collections.Statistics();
		
		// Which collection to focus on
		this.collection = this.model.statistics;
		
		// Listen to model
		this.listenTo(this.collection, 'request', this.showloading);
		this.listenTo(this.collection, 'ready', this.hideloading);
		this.listenTo(Cloudwalkers.RootView, "resize", this.resize);
		
		google.load('visualization', '1',  {'callback': function () { this.gloaded = true; }.bind(this), 'packages':['corechart']});
		
	}
});