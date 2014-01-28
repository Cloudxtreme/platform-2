Cloudwalkers.Views.Widgets.Chart = Backbone.View.extend({
	
	'title' : "Chart",
	'events' : 
	{
		/*'remove' : 'destroy',
		'click *[data-action]' : 'action',
		'click [data-notifications]' : 'loadNotifications',
		'click [data-youtube]' : 'loadYoutube',
		'click' : 'toggle'*/
	},
	
	'initialize' : function (options)
	{
		if(options) $.extend(this, options);
		
		this.listenTo(this.model, 'change', this.render);
	},

	'render' : function ()
	{
		
		this.$el.html (Mustache.render (Templates.chart, {title: this.title}));
		
		console.log(this.$el.find("canvas").get(0))
			
		// Select data & chart type
		var data  = this.parse[this.chart](this.model)
		var chart = new Chart(this.$el.find("canvas").get(0).getContext("2d"))[this.chart](data);

		
		
		return this;
	},
	
	'parse' : {
		PolarArea : function (model)
		{
			return [ 
				{
					value : 30,
					color: "#D97041"
				},
				{
					value : 90,
					color: "#C7604C"
				},
				{
					value : 24,
					color: "#21323D" 
				},
				{
					value : 58,
					color: "#9D9B7F"
				},
				{
					value : 82,
					color: "#7D4F6D"
				},
				{
					value : 8,
					color: "#584A5E"
				}
			]
		}
	},
	
	'negotiateFunctionalities' : function()
	{
		
		
	}
	

});