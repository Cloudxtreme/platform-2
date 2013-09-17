Cloudwalkers.Views.Widgets.CombinedStatistics = Cloudwalkers.Views.Widgets.Widget.extend ({

	'size': 'full',
	'currentReport' : null,
	'element' : null,

	'render' : function ()
	{
		var self = this;
		var data = {};
		var el = this.$el;

		this.element = el;

		data.reports = [];
		data.stream = this.options.stream;

		for (var i = 0; i < this.options.reports.length; i ++)
		{
			data.reports.push (this.options.reports[i].attributes);
		}

		data.intervals = [
			{
				'name' : 'Days',
				'token' : 'day'
			},
			{
				'name' : '7 days',
				'token' : '7days'
			},
			{
				'name' : '28 days',
				'token' : '28days'
			}
		];

		//console.log (this.options.reports);
		el.html (Mustache.render (Templates.combinedstatistics, data));

		// Change report events
		function attachReportEvent (report)
		{
			//console.log ('[data-report-id="' + report.get ('uniqueid') + '"]');
			el.find ('[data-report-id="' + report.get ('uniqueid') + '"]').click (function ()
			{
				self.setReport (report);
			});
		}

		function attachIntervalEvent (interval)
		{
			el.find ('[data-interval-id="' + interval.token + '"]').click (function ()
			{
				el.find ('.interval-value').html (interval.name);

				// Calculate date interval
				var units = 10;

				var days = 1;
				if (interval.token == 'day')
				{
					days = units;
				}
				else if (interval.token == '7days')
				{
					days = 7 * units;
				}
				else if (interval.token == '28days')
				{
					days = 28 * units;
				}

				var now = new Date();
				var today = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

				var start = new Date (today.getTime () - (60 * 60 * 24 * days * 1000));
				var end = today;

				//console.log ('Setting daterange from ' + start + ' to ' + end);

				for (var i = 0; i < self.options.reports.length; i ++)
				{
					self.options.reports[i].getDataset ().setInterval (interval.token);

					// Also set date range.
					self.options.reports[i].getDataset ().setDateRange (start, end);
				}

				if (self.currentReport)
				{
					self.currentReport.getDataset ().refresh ();
				}
			});
		}

		for (var i = 0; i < this.options.reports.length; i ++)
		{
			attachReportEvent (this.options.reports[i]);
		}

		for (var i = 0; i < data.intervals.length; i ++)
		{
			attachIntervalEvent (data.intervals[i]);
		}

		el.find ('[data-interval-id="' + data.intervals[0].token + '"]').click ();

		this.setReport (this.options.reports[0]);

		return this;
	},

	'setReport' : function (report)
	{
		this.element.find ('.report-value').html (report.get ('name'));

		this.currentReport = report;

		var div = $('<div></div>');
		this.$el.find ('.portlet-body').html (div);

		this.$el.find ('.statistic-title').html (report.get ('name'));

		report.getWidget ().innerRender (div);
	}

});