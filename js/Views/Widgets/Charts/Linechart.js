Cloudwalkers.Views.Widgets.Charts.Linechart = Cloudwalkers.Views.Widgets.Widget.extend ({

	'title' : 'Line chart',
	'placeholder' : null,
	'icon' : 'reorder',

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
					'mode' : 'time'
				},

				'yaxis' : {
					'tickDecimals' : 0
				}
			}
		);
	}

});