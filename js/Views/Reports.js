Cloudwalkers.Views.Reports = Cloudwalkers.Views.Widgets.WidgetContainer.extend({

	'navclass' : 'reports',
	'title' : 'Reports',
	'half' : true,

	'datepicker' : null,

	'initializeWidgets' : function ()
	{
		//console.log (this.options);
		this.datepicker = new Cloudwalkers.Views.Widgets.Datepicker ();
		this.addWidget (this.datepicker, true);

		if (typeof (this.options.stream) == 'undefined' || !this.options.stream)
		{
			var streams = Cloudwalkers.Session.getStreams ();
			var self = this;

			for (var i = 0; i < streams.length; i ++)
			{
				this.addStreamWidgets (streams[i]);
			}
		}

		else
		{
			this.addStreamWidgets (this.options.stream);
		}
	},

	'addStreamWidgets' : function (stream)
	{
		var self = this;
		$.ajax 
		(
			CONFIG_BASE_URL + 'json/stream/' + stream.id + '/statistics',
			{
				'success' : function (data)
				{
					if (data.statistics.length > 0)
					{
						// Title
						var title = new Cloudwalkers.Views.Widgets.Title ({ 'title' : stream.name });
						self.addWidget (title, true);

						self.half = true;

						for (var j = 0; j < data.statistics.length; j ++)
						{
							self.addStreamWidget (stream, data.statistics[j]);
						}
					}
				}
			}
		);
	},

	'addStreamWidget' : function (stream, statdata)
	{
		var self = this;

		var dataurl = CONFIG_BASE_URL + 'json/stream/' + stream.id + '/statistics/' + statdata;

		var statistics = new Cloudwalkers.Models.StatisticDataset ({ 'dataurl' : dataurl });

		self.datepicker.on ('date:change', function (start, end)
		{
			statistics.setDateRange (start, end);
		});

		var widget = new Cloudwalkers.Views.Widgets.Charts.Linechart ({
			'dataset' : statistics,
			'title' : stream.name + ' ' + statdata
		});

		self.addHalfWidget (widget, self.half);
		self.half = !self.half;
	}
});