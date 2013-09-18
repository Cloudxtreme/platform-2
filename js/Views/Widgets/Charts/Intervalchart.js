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

		var plot = $.plot 
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

				series: {
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
					shadowSize: 2
				},

				'bars' : {
					'show': true,
					'align': 'center',
					'barWidth': 0.8
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
				growth = (values[i][1] - values[i-1][1]) / values[i-1][1];
				growth *= 100;
				growth = Math.floor (growth);

				o = plot.pointOffset({ x: values[i][0], y: values[i][1]});
				this.placeholder.append ('<div style="position: absolute; left: ' + (o.left - 20) + 'px; top: ' + (o.top - 25) + 'px; width: 40px; text-align: center;">' + growth + '%</div>');
			}
		}
	}

});