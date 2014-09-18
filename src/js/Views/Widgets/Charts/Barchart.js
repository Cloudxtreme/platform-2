Cloudwalkers.Views.Widgets.Charts.Barchart = Cloudwalkers.Views.Widgets.Widget.extend ({

	'title' : 'Bar chart',
	'placeholder' : null,
	'icon' : 'reorder',
	'size' : 6,

	'getDataset' : function ()
	{
		return this.options.model;
	},

	'innerRender' : function (element)
	{
		
		var self = this;

		this.placeholder = $('<div class="chart" style="position: relative;"></div>');

		element.html ('');
		element.append (this.placeholder);

		this.options.model.getValues (function (values)
		{
			self.plot (values);
		});

		this.options.model.on ('dataset:change', function (values)
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
			ticks.push ([ i, values[i][0] ]);
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
					'align': 'center',
					'fill': .78,
					'lineWidth': 1
				},

				'colors' : [ '#2bbedc', '#ffb848', '#852b99', '#e02222', '#ffe399']
			}
		);
	}

});