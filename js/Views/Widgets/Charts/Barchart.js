Cloudwalkers.Views.Widgets.Charts.Barchart = Cloudwalkers.Views.Widgets.Widget.extend ({

	'title' : 'Bar chart',
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
		$.plot 
		(
			this.placeholder, 
			[ values ], 
			{
				'xaxis' : {

				},

				'yaxis' : {
					'tickDecimals' : 0
				}
			}
		);
	}

});