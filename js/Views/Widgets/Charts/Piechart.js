Cloudwalkers.Views.Widgets.Charts.Piechart = Cloudwalkers.Views.Widgets.Widget.extend ({

	'title' : 'Pie chart',
	'placeholder' : null,

	'innerRender' : function (element)
	{
		var self = this;

		this.placeholder = $('<div class="chart" style="position: relative;"></div>');

		element.html ('');
		element.append (this.placeholder);

		this.options.dataset.getValues (function (values)
		{
			self.plot (values);
		});

		this.options.dataset.on ('dataset:change', function (values)
		{
			self.plot (values);
		});
	},

	'plot' : function (values)
	{
		var piedata = [];

		for (var i = 0; i < values.length; i ++)
		{
			piedata.push ({
				'label' : values[i][0],
				'data' : values[i][1]
			});
		}

		$.plot 
		(
			this.placeholder, 
			piedata, 
			{
				'series' : {
					'pie' : {
						'show' : true
					}
				}
			}
		);
	}

});