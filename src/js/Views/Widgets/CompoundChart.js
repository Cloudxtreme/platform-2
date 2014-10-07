define(
	['backbone'],
	function (Backbone)
	{
		var CompoundChart = Backbone.View.extend({

			templatemap : {
				'2col1row' : ['#col1', '#col2', '#row1'],
				'2row' : ['#row1', '#row2']
			},

			initialize : function (options)
			{
				if(options) $.extend(this, options);
				view = this;
				this.collection = this.model.statistics;	
			
				//this.listenTo(this.collection, 'ready', this.fill);

				this.charttemplate = "compoundchart"+this.options.template;
				this.template = this.options.template;
				this.charts = this.options.chartdata;
				
			},

			render : function ()
			{	
				// Create view
				this.settings = {};
				this.settings.title = this.title;

				this.$el.html (Mustache.render (Templates[this.charttemplate], this.settings));
				this.fill();
				return this;
			},

			fill : function(){

				//Hack to prevent double loading
				if(this.filled)	return true;

				$.each(this.charts, function(index, chart){
					chart.data.model = this.model;
					chart.data.network = this.network;
					
					var widget = this.functioncall(chart.widget)
					
					var view = new widget(chart.data).render().el;

					this.$el.find(this.templatemap[this.template][index]).append(view);
					
				}.bind(this));

				this.filled = true;
			},

			functioncall : function(functionname, args)
			{	
				var func = window[functionname];
				 
				// is it a function?
				if (typeof func === "function")

					return func.apply(null, args);
			},

			negotiateFunctionalities : function()
			{

			}
			
		});

		return CompoundChart;
});