Cloudwalkers.Views.Reports = Cloudwalkers.Views.Widgets.WidgetContainer.extend({

	'navclass' : 'reports',
	'title' : 'Reports',

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
			CONFIG_BASE_URL + 'json/stream/' + stream.get ('id') + '/statistics',
			{
				'success' : function (data)
				{
					if (data.statistics.length > 0)
					{
						// Title
						var title = new Cloudwalkers.Views.Widgets.Title ({ 'title' : stream.attributes.customname });
						self.add (title);

						// We're going to combine all plain statistics in a special, combined widget.
						var plainstatistics = [];
						var other = [];

						for (var j = 0; j < data.statistics.length; j ++)
						{
							if (data.statistics[j].token == 'plainstatistics')
							{
								plainstatistics.push (data.statistics[j]);
							}

							else
							{
								other.push (data.statistics[j]);
							}
						}

						// Add combined statistic (on top)
						self.addCombinedWidget (stream.attributes, plainstatistics);

						// Add all others
						for (var i = 0; i < other.length; i ++)
						{
							self.addReportWidget (stream.attributes, other[i]);
						}
					}
				}
			}
		);
	},

	'addCombinedWidget' : function (stream, reportsdata)
	{
		var self = this;
		var reports = [];
		var report;

		var daterange = self.datepicker.getDateRange ();

		for (var i = 0; i < reportsdata.length; i ++)
		{
			reportsdata[i].stream = stream;
			report = new Cloudwalkers.Models.Report (reportsdata[i]);			
			report.getDataset ().setDateRange (daterange[0], daterange[1]);

			reports.push (report);
		}

		var widget = new Cloudwalkers.Views.Widgets.CombinedStatistics ({ 'reports' : reports, 'stream' : stream });

		widget.color = stream.network.icon + '-color';
		widget.network = stream.network;

		this.add (widget);
	},

	'addReportWidget' : function (stream, reportdata)
	{
		var self = this;

		//var dataurl = CONFIG_BASE_URL + 'json/' + statdata.url;

		reportdata.stream = stream;

		var report = new Cloudwalkers.Models.Report (reportdata);

		var widget = report.getWidget ();

		var daterange = self.datepicker.getDateRange ();
		widget.getDataset ().setDateRange (daterange[0], daterange[1]);

		widget.color = stream.network.icon + '-color';
		widget.network = stream.network;

		self.datepicker.on ('date:change', function (start, end)
		{
			widget.getDataset ().setDateRange (start, end);
		});
		
		// Check widget size
		this.add (widget);
	}
});