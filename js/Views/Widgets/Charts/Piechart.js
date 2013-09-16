Cloudwalkers.Views.Widgets.Charts.Piechart = Cloudwalkers.Views.Widgets.Widget.extend ({

	'title' : 'Pie chart',
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
		if (values.length == 0)
		{
			this.placeholder.html ('<p>At this time there is no information available.</p>');
			return;
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