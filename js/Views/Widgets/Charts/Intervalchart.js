Cloudwalkers.Views.Widgets.Charts.Intervalchart = Cloudwalkers.Views.Widgets.Widget.extend ({

	'title' : 'Bar chart',
	'placeholder' : null,
	'icon' : 'reorder',
	'size' : 6,

	'getDataset' : function ()
	{
		return this.options.dataset;
	},

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
			self.plot (values[0].values);
		});
	},

	'plot' : function (values)
	{
		if (!values)
		{
			return;
		}

		// Afraid we'll have to prepare the data for this one
		var ticks = [];
		for (var i = 0; i < values.length; i ++)
		{
			// Only show one in 3
			ticks.push ([ i, new Date (values[i][0]).toLocaleDateString() ]);
			values[i][0] = i;
		}

		$.plot 
		(
			this.placeholder, 
			[ values ], 
			{
				'xaxis' : {
					'ticks' : ticks
				},

				'yaxis' : {
					'tickDecimals' : 0
				},
				'bars' : {
					'show': true,
					'align': 'center'
				}
			}
		);
	}

});