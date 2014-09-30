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
		{widget: "BestTimeToPost", data: {filterfunc: "besttime", chart: "LineChart", title: "Best Time to Post"}, span: 4},
		{widget: "Chart", data: {filterfunc: "message-evolution-network", chart: "LineChart", title: "Messages Evolution"}, span : 4},
		{widget: "HeatCalendar", data: {filterfunc: "activity", title: "Activity Calendar"}, span: 4},

		//{widget: "TitleSeparator", data: {title: "Geo Graphics"}, networks : ['facebook']},
		{widget: "Chart", data: {filterfunc: "geo", type: "dots", chart: "GeoChart", title: "Countries", connect : true}, networks : ['facebook'], span: 8},
		{widget: "CompoundChart", span: 4, data : { template: "2row", chartdata: [ 
			{widget: "Chart", data: {filterfunc: "regional", chart: "PieChart", title: "Countries"}, connect: 'regional'},
			{widget: "Chart", data: {filterfunc: "cities", chart: "PieChart", title: "Cities"}}
			]}, networks : ['facebook']
		},
	],
	
	/**
	 *	Stream Data
	 *	Add streamlevel data to widget object
	 */
	streamdata: function (widget)
	{
		// network token
		var network = Cloudwalkers.Session.getStream (Number(this.streamid)).get ("network").token;
		var data = {};	
		
		if (_.isString (widget.data))
			widget.data = this.networkspecific[widget.data][network];
			
		data.network = this.streamid;

		return _.extend (widget.data, data);
	}
});