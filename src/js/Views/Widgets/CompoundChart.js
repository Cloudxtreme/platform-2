define(
	['backbone', 'mustache', 'Views/Widgets/Chart'],
	function (Backbone, Mustache, Chart)
	{
		var CompoundChart = Backbone.View.extend({

			templatemap : {
				'2col1row' : ['#col1', '#col2', '#row1'],
				'2row' : ['#row1', '#row2']
			},

			options : {},

			initialize : function (options)
			{
				if(options){
				 	$.extend(this, options);
				 	$.extend(this.options, options);
				}

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

			fill : function()
			{	
				//Temporary hack to map widgets
				var widgetmap = {
					'Chart' : Chart
				}

				//Hack to prevent double loading
				if(this.filled)	return true;

				$.each(this.charts, function(index, chart){
					
					chart.data.network = this.network;
					chart.data.parentview = this.parentview;

					var view = new widgetmap[chart.widget](chart.data).render().el;

					this.parentview.views.push (view);

					this.$el.find(this.templatemap[this.template][index]).append(view);
					
				}.bind(this));

				this.filled = true;
			}

		});

		return CompoundChart;
});