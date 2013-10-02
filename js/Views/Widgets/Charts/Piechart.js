Cloudwalkers.Views.Widgets.Charts.Piechart = Cloudwalkers.Views.Widgets.Widget.extend ({

	'title' : 'Pie chart',
	'placeholder' : null,
	'icon' : 'reorder',
	'size' : 6,

	'maxSlices' : 10,

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
		if (values.length == 0)
		{
			this.placeholder.html ('<p>At this time there is no information available.</p>');
			return;
		}

		// First sort on value
		values.sort (function (a, b)
		{
			return b[1] - a[1];
		});

		var other = 0;
		if (values.length > this.maxSlices)
		{
			while (values.length > (this.maxSlices - 1))
			{
				other += values.pop ()[1];
			}

			values.push ([ 'Other', other ]);
		}

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