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
		
		var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
		var besttime,
			data = [],
			maxvalue = 0,
		 	dailyvalue = 0,
		 	fill,
		 	max,
		 	time;

		collection.forEach(function(statistic){
			var streams = statistic.get("streams");
			var daily 	= [];
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
			
			time = daily.indexOf(Math.max.apply(Math,_.values(daily)));
			data.push({day: days.shift(), value: dailyvalue, time: time});

			dailyvalue = 0;
		});

		data["maxvalue"] = maxvalue;
		
		return data;
	},

	'negotiateFunctionalities' : function()
	{

	}
	
});