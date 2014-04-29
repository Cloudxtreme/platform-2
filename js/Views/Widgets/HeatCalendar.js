Cloudwalkers.Views.Widgets.HeatCalendar = Backbone.View.extend({
	
	'title' : "Info",
	
	'initialize' : function (options)
	{
		if(options) $.extend(this, options);
		
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'ready', this.fill);
	},

	'render' : function ()
	{
		
		this.$el.html ("<div id='cal-heatmap'></div>");
		return this;
		
	},

	'fill' : function(){
		var cal = new CalHeatMap();
		cal.init({
			domain: "month",
			subDomain: "day",
			data: "http://kamisama.github.io/cal-heatmap/datas-years.json",
			start: new Date(2000, 0),
			cellSize: 10,
			range: 1,
			legend: [20, 40, 60, 80]
		});
		
	},
	
	'negotiateFunctionalities' : function()
	{
		
	}
});