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

	'numberOutput' : function (number)
	{
		if (number >= 0)
		{
			return '+ ' + number;
		}
		else
		{
			return '- ' + Math.abs (number);
		}
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
		var date;
		var datestring;

		var start = 0;

		// If values is more than 10 (so, most of the times, 11), skip the first value.
		if (values.length > 10)
		{
			start = 1;
		}

		// Values less than 10?
		while (values.length < 10)
		{
			values.unshift ([null, 0]);
		}

		for (var i = start; i < values.length; i ++)
		{
			// Only show one in 3
			if (values[i][0] != null)
			{
				date = new Date (values[i][0]);
				datestring = date.getDate () + '/' + (date.getMonth () + 1) + '/' + date.getFullYear ();
			}
			else
			{
				datestring = '';
			}

			ticks.push ([ i, datestring ]);
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
					'tickDecimals' : 0,
					'min' : 0
				},

				'series': {
					'stack' : true,

					'shadowSize': 2,

					'bars' : {
						'show': true,
						'align': 'center',
						'barWidth': 0.8,
						'fill': .78,
						'lineWidth': 1
					}
				},

                'grid' : {
                  margin: 50
                },

				'colors' : [ '#2bbedc', '#ffb848', '#852b99', '#e02222', '#ffe399']
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

				if (values[i][1] > 0 && values[i-1][1] > 0)
				{
					growth = (values[i][1] - values[i-1][1]) / Math.max(1, values[i-1][1]);
					growth *= 100;
					growth = Math.floor (growth);

					growth = this.numberOutput (growth) + '%';

					o = plot.pointOffset({ x: values[i][0], y: values[i][1]});
					this.placeholder.append ('<div style="background: white; position: absolute; left: ' + (o.left - 30) + 'px; top: ' + (o.top - 25) + 'px; width: 60px; text-align: center;">' + growth + '</div>');
				}
			}
		}
	}

});