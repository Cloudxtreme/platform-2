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
		if(this.filled)
			return;

		var fulldata = this.collection.parsebesttime();
		
		$.each(fulldata, function(key, day){
			day.fill = day.value*100/fulldata["maxvalue"];
			day.time = day.time >= 0 ? day.time+"h" : "";
			this.$el.find(".chart-wrapper").append(Mustache.render (Templates.besttime, day));
		}.bind(this));

		this.filled = true;
	},

	'negotiateFunctionalities' : function()
	{

	}
	
});