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
						var title = new Cloudwalkers.Views.Widgets.Title ({ 'title' : stream.customname });
						self.addWidget (title, true);

						self.half = true;

						for (var j = 0; j < data.statistics.length; j ++)
						{
							self.addStreamWidget (stream, data.statistics[j]);
						}
					}

					// Now also add the reports
					for (var i = 0; i < stream.reports.length; i ++)
					{
						self.addReportWidget (stream, stream.reports[i]);
					}
				}
			}
		);
	},

	'addStreamWidget' : function (stream, statdata)
	{
		var self = this;

		var dataurl = CONFIG_BASE_URL + 'json/stream/' + stream.id + '/statistics/' + statdata.token;

		var daterange = self.datepicker.getDateRange ();

		// Replace all by numbers for now
		var statistics = new Cloudwalkers.Models.StatisticDataset 
		({ 
			'dataurl' : dataurl + '/number' 
		});
		statistics.setDateRange (daterange[0], daterange[1]);

		self.datepicker.on ('date:change', function (start, end)
		{
			statistics.setDateRange (start, end);
		});

		var widget = new Cloudwalkers.Views.Widgets.Charts.Comparison ({
			'dataset' : statistics,
			'title' : stream.customname + ' ' + statdata.name
		});

		widget.color = stream.network.icon + '-color';
		//widget.color = 'purple';

		self.addHalfWidget (widget, self.half);
		self.half = !self.half;
	},

	'addReportWidget' : function (stream, reporttoken)
	{
		var self = this;

		var dataurl = CONFIG_BASE_URL + 'json/stream/' + stream.id + '/statistics/report/' + reporttoken;

		var report = new Cloudwalkers.Models.Report ({ 'dataurl' : dataurl });

		report.getWidget (function (widget, dataset)
		{
			var daterange = self.datepicker.getDateRange ();
			dataset.setDateRange (daterange[0], daterange[1]);

			widget.color = stream.network.icon + '-color';

			self.datepicker.on ('date:change', function (start, end)
			{
				dataset.setDateRange (start, end);
			});
			
			// Check widget size
			if (typeof (widget.size) != 'undefined')
			{
				if (widget.size == 'full')
				{
					self.addWidget (widget, true);
					self.half = true;
				}
				else
				{
					self.addHalfWidget (widget, self.half);
					self.half = !self.half;	
				}
			}
			else
			{
				self.addHalfWidget (widget, self.half);
				self.half = !self.half;
			}
		});
	}
});