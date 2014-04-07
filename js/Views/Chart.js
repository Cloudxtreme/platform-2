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
		
		this.listenTo(this.model.statistics, 'ready', this.fill);
	},

	'render' : function ()
	{	
		// Create view
		this.$el.html (Mustache.render (Templates.chart, {title: this.title}));
		this.canvas = this.$el.find("canvas").get(0).getContext("2d");
		
		// Select data & chart type
		var data  = this.parse[this.chart]();
		var chart = new Chart(this.canvas)[this.chart](data);

		return this;
	},
	
	'fill' : function (collection)
	{
		
		
		
		this.parse.collection = collection;
		
		// Select data & chart type
		var data  = this.parse[this.chart](this.model, this.filterfunc)
		var chart = new Chart(this.canvas)[this.chart](data);
	},
	
	'parse' : {
		PolarArea : function (model, func)
		{
			// Placeholder data
			if(!model)
				return [{value :50, color: "#ffffff"}, {value :100, color: "#f9f9f9"}];
			
			else return this.collection[func]();
		},
		
		Doughnut : function (model, func)
		{
			
			// Placeholder data
			if(!model)
				return [{value :50, color: "#f7f7f7"}, {value :50, color: "#fafafa"}];
			
			var stat = this.collection.latest();
			
			return stat[func]();
			
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
			// Placeholder data
			if(!model)
				return {labels : ["",""], datasets : [{fillColor : "rgba(220,220,220, .1)", pointStrokeColor : "#fff", data : [1,100]}]};
			
			
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