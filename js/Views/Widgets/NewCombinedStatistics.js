Cloudwalkers.Views.Widgets.NewCombinedStatistics = Backbone.View.extend({

	'streamid': 216,
	'reports' : {
		'facebook' : ['evolution', 'activity']
	},

	'funcs' : {
		'evolution' : {data : {title: "Contact Evolution", filterfunc: "contact-evolution"}, span: 3},
		'activity' : {data : {title: "Contact Evolution", filterfunc: "contact-evolution"}, span: 3}
	},

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
		var data;
		var width = this.$el.find(".statistic-container").get(0).clientWidth;
		var fulldata = this.parseevolution(this.collection);
		var options = {
			'chartArea': {'width': '90%', 'height': '80%'},
            'width': width,
            'height': width * 0.4,
        };

        $.extend(options, fulldata.options);
		data = google.visualization.arrayToDataTable(fulldata.data);

		chart = new google.visualization.LineChart(this.$el.find('.statistic-container').get(0));
        chart.draw(data, options);

        this.fillinfo(this.settings.reports);
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