Cloudwalkers.Views.Widgets.HeatCalendar = Backbone.View.extend({
	
	'title' : "Info",
	'filled' : false,
	'nummonths' : {
		'quarter' : 3,
		'year' : 12
	},
	
	'initialize' : function (options)
	{
		if(options) $.extend(this, options);
		
		this.collection = this.parentview.collection;

		//this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.collection, 'ready', this.fill)
	},

	'render' : function ()
	{	
		/* This should be in the Widget
		if(this.widgets[n].data.title == translate.activity_calendar)
		{
			if (this.timespan == translate.this)	quarter.widgets[n].span = 6;
			else if (this.timespan == 'year')
			{
				this.widgets[n].span = 12;
				this.widgets[n].data.bigdata = true;
			}
			else
			{
				this.widgets[n].span = 4;
				this.widgets[n].data.bigdata = false;
			}							
		}*/
		
		this.$el.html (Mustache.render (Templates.activitycalendar, this.options));
		return this;
	},

	'fill' : function(){

		if(this.filled)	return false;

		var resizesettings;
		var cal = new CalHeatMap();
		var data = this.calculatedata();
		
		var settings = {
			itemSelector: this.$el.find('#cal-heatmap').get(0),
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
		};

		if(this.span == 'quarter' || this.span == 'year'){
			resizesettings = this.calculatesizes(this.nummonths[this.span]);

			if(this.nummonths[this.span] == 12)	delete settings.subDomainTextFormat;
			
			$.extend(settings, resizesettings);
		}
		
		cal.init(settings);

		//Year view
		/*
		cal.init({
			cellSize: 25,
			cellPadding: 6,
			rowLimit: 4,
			domainGutter: 15,
			range: 2,
		});
		*/

		this.filled = true;

	},

	'calculatesizes' : function(nummonths)
	{
		var containerwidth = this.$el.find('#cal-heatmap').get(0).clientWidth;
		var monthwidth = (containerwidth - 40)/nummonths;

		var settings = {
			subDomain : "day",
			cellSize : monthwidth * 0.15,
			cellPadding : (monthwidth * 0.15) / 3,
			range : nummonths
		}

		return settings;
	},

	'calculatedata' : function(){
		
		var statistics = $.extend(true, {}, this.collection);
		var data = {};
		var max = 0, min = 0, day, timestamp, date = 0, msgpivot = 0;
		
		if(statistics.models.length >= 2)
		{
			while(statistics.models.length >= 2)
			{
				var statistic1 = statistics.models.shift();
				var statistic2 = statistics.models[0];
				
				var messages = statistic2.pluck("messages", this.parentview.streamid) - statistic1.pluck("messages", this.parentview.streamid);
				
				timestamp = new Date(statistic2.get("date")).getTime()/1000;

				data[timestamp] = messages;

				//Get starting statistics date
				if(date == 0)	date = statistic2.get("date");
			}		
		}
		
		if(statistics.models.length == 1)
			date = statistics.models.shift().get("date")

		return {data: data, legend: this.generaterange(data,4), date: date};
	},

	'generaterange' : function(data, steps){

		var max = _.max(data, function(day){ return day });
		var min = _.min(data, function(day){ return day });
		var step = (max-min)/steps;
		var legend = [];

		for(var i=1; i <= steps; i++){
			legend.push(step*i);
		}
		
		return legend;
	},

	
	'negotiateFunctionalities' : function()
	{
		
	}
});