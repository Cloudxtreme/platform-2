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

		var basevalue = [];
		var additions = [];

		for (var i = 0; i < values.length; i ++)
		{
			// Only show one in 3
			ticks.push ([ i, new Date (values[i][0]).toLocaleDateString() ]);
			values[i][0] = i;

			if (i == 0)
			{
				basevalue.push ([ i, values[i][1] ]);
				additions.push ([ i, 0 ]);
			}
			else
			{
				if (values[i-1][1] <= values[i][1])
				{
					basevalue.push ([ i, values[i-1][1] ]);
					additions.push ([ i, values[i][1] - values[i-1][1] ]);
				}
				else
				{
					basevalue.push ([ i, values[i][1] ]);
					additions.push ([ i, 0 ]);
				}
			}
		}

		var plot = $.plot 
		(
			this.placeholder, 
			[ basevalue, additions ], 
			{
				'xaxis' : {
					'ticks' : ticks
				},

				'yaxis' : {
					'tickDecimals' : 0
				},

				series: {
					stack : true,

/*
					lines: {
						show: true,
						lineWidth: 2,
						fill: true,
						fillColor: {
							colors: [{
									opacity: 0.05
								}, {
									opacity: 0.01
								}
							]
						}
					},
					points: {
						show: true
					},
*/
					
					shadowSize: 2,

					'bars' : {
						'show': true,
						'align': 'center',
						'barWidth': 0.8
					}
				}
			}
		);

		// Points
		var o;
		var growth;
		for (var i = 0; i < values.length; i ++)
		{
			if (i > 0)
			{
				values[i][1] = parseInt(values[i][1]);

				growth = (values[i][1] - values[i-1][1]) / Math.max(1, values[i-1][1]);
				growth *= 100;
				growth = Math.floor (growth);

				o = plot.pointOffset({ x: values[i][0], y: values[i][1]});
				this.placeholder.append ('<div style="position: absolute; left: ' + (o.left - 20) + 'px; top: ' + (o.top - 20) + 'px; width: 40px; text-align: center;">' + growth + '%</div>');
			}
		}
	}

});