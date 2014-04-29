Cloudwalkers.Views.Widgets.HeatCalendar = Backbone.View.extend({
	
	'title' : "Info",
	
	'initialize' : function (options)
	{
		if(options) $.extend(this, options);
		
		this.collection = this.model.statistics;

		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.collection, 'ready', this.fill)
	},

	'render' : function ()
	{
		this.$el.html (Mustache.render (Templates.activitycalendar, this.options));
		return this;
	},

	'fill' : function(){

		var cal = new CalHeatMap();
		var data = this.calculatedata();
		
		cal.init({
			domain: "month",
			subDomain: "x_day",
			data: data.data,
			start: Date.parse(data.date),
			cellSize: 36,
			cellPadding: 8,
			range: 1,
			legend: data.legend,
			label : {height: 30},
			subDomainTextFormat: "%d"
		});
	},

	'calculatedata' : function(){
		
		var statistics = this.collection;	
		var data = {};
		var max = 0, min = 0, day, timestamp, date = 0, msgpivot = 0;

		while(statistics.size() > 0){
			var statistic = statistics.shift();
			var messages = statistic.pluck("messages");
			
			timestamp = new Date(statistic.get("date")).getTime()/1000;

			data[timestamp] = messages >= msgpivot ? messages - msgpivot : 0;
			msgpivot = messages;

			//Get starting statistics date
			if(date == 0)	date = statistic.get("date");
		}

		return {data: data, legend: this.generaterange(data,6), date: date};
	},

	'generaterange' : function(data, steps){

		var max = _.max(data, function(day){ return day });
		var min = _.min(data, function(day){ return day });
		var step = ((max-min)/steps) - steps/2;
		var legend = [];

		for(var i=1; i < steps; i++){
			legend.push(step*i);
		}

		return legend;
	},

	
	'negotiateFunctionalities' : function()
	{
		
	}
});