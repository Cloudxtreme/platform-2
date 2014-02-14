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
		
		this.listenTo(this.model.statistics, 'seed', this.render);
	},

	'render' : function ()
	{
		
		console.log(this.model.statistics.models)
		
		this.$el.html (Mustache.render (Templates.chart, {title: this.title}));
			
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
		},
		
		Doughnut : function (model)
		{
			return [
				{
					value: 30,
					color:"#F7464A"
				},
				{
					value : 50,
					color : "#E2EAE9"
				},
				{
					value : 100,
					color : "#D4CCC5"
				},
				{
					value : 40,
					color : "#949FB1"
				},
				{
					value : 120,
					color : "#4D5360"
				}
			]
		},
		
		Line : function (model)
		{
			return {
				labels : ["January","February","March","April","May","June","July"],
				datasets : [
					{
						fillColor : "rgba(220,220,220,0.5)",
						strokeColor : "rgba(220,220,220,1)",
						pointColor : "rgba(220,220,220,1)",
						pointStrokeColor : "#fff",
						data : [65,59,90,81,56,55,40]
					},
					{
						fillColor : "rgba(151,187,205,0.5)",
						strokeColor : "rgba(151,187,205,1)",
						pointColor : "rgba(151,187,205,1)",
						pointStrokeColor : "#fff",
						data : [28,48,40,19,96,27,100]
					}
				]
			}
		}
	},
	
	'negotiateFunctionalities' : function()
	{
		
		
	}
	

});