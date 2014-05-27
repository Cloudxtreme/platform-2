Cloudwalkers.Views.Widgets.BestTimeToPost = Backbone.View.extend({

	'initialize' : function (options)
	{
		if(options) $.extend(this, options);
		
		this.settings = {};
		this.settings.title = this.title;

		this.collection = this.model.statistics;
		this.listenTo(this.collection, 'ready', this.fill);
	},

	'render' : function ()
	{	
		this.$el.html (Mustache.render (Templates.besttimewrap, this.settings));		
		return this;
	},

	'fill' : function(){

		var fulldata = this.parsebesttime(this.collection);
		
		$.each(fulldata, function(key, day){
			day.fill = day.value*100/fulldata["maxvalue"];
			this.$el.find(".chart-wrapper").append(Mustache.render (Templates.besttime, day));
		}.bind(this));
	},

	parsebesttime : function(collection){
		//Hack to prevent double loading
		if(this.filled)	return true;

		var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
		var besttime,
			data = [],
			maxvalue = 0,
		 	dailyvalue = 0,
		 	fill,
		 	max,
		 	time;

		var statistics = collection.models;

		//Always the last 7 results
		if(collection.length > 7)
			statistics = statistics.splice(7, statistics.length-1);

		$.each(days, function(index, day){
			var statistic = statistics[index];
			var daily 	= [];

			if(statistic){
				var streams = statistic.get("streams");
				streams.forEach(function(stream){
					stream 	= new Cloudwalkers.Models.Stream(stream);
					besttime = stream.getbesttime();
					
					if(besttime){
						if(daily.length == 0){
							daily = _.values(besttime);
						}else{
							for(i in besttime){							
								daily[i] += besttime[i];
		
								//Keep track of the highest week & daily value
								if(daily[i]>maxvalue)	maxvalue=daily[i];
								if(daily[i]>dailyvalue)	dailyvalue=daily[i];
							}
						}
					}
				});
			}
			
			if(daily.length > 0)
				time = daily.indexOf(Math.max.apply(Math,_.values(daily)));
			else
				time = 0;

			data.push({day: days.shift(), value: dailyvalue, time: time});

			dailyvalue = 0;
		});

		data["maxvalue"] = maxvalue;
		
		this.filled = true;
		
		return data;
	},

	'negotiateFunctionalities' : function()
	{

	}
	
});