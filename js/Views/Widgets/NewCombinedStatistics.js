Cloudwalkers.Views.Widgets.NewCombinedStatistics = Backbone.View.extend({

	'streamid': 216,
	'reports' : {
		'facebook' : ['evolution', 'activity']
	},
	//Info rendering stuff
	'funcs' : {
		'evolution' : {data : {title: "Fans Evolution", filterfunc: "contact-evolution"}, span: 3},
		'activity' : {data : {title: "Activity evolution", filterfunc: "post-activity"}, span: 3}
	},
	//Chart rendering stuff
	'charts' : [
		{data : {title: "Single network chart", chart: 'LineChart', filterfunc: "evolution", network: "facebook"}, span: 6},
		{data : {title: "Multiple network chart", chart: 'LineChart', filterfunc: "evolution"}, span: 6}
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
		var fulldata = this.parseevolution(this.collection);

        this.fillcharts(fulldata, width);
        this.fillinfo(this.settings.reports);

        this.filled = true;	
	},

	'fillcharts' : function(fulldata, width)
	{
        var charts = this.charts;

        for(n in charts){
			charts[n].data.model = this.model;
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

	'parseevolution' : function(collection)
	{
		var length = collection.length;
		var fulldata = {
			data : [],
			options : {
				color : ["#2bbedc"],
				curveType: 'function',
   				legend: { position: 'bottom' }
			}
		};

		//Get the contacts from the collection
		for (var i = 0; i < length; i++){
			var streams = collection.place(i).get("streams");
			$.each(streams, function(index, stream){

				if(stream.id == this.streamid){
					fulldata.data.push([i, _.isObject(stream.contacts) ? stream.contacts.total : stream.contacts]);
					return false;
				}
			}.bind(this));
		}
	
		fulldata.data.unshift(["Evolution", "Number of fans"]);
		
		return fulldata;
		
	},

	'negotiateFunctionalities' : function()
	{

	}
	
});