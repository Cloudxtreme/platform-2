Cloudwalkers.Views.Widgets.CombinedStatistics = Cloudwalkers.Views.Widgets.Widget.extend ({

	'size': 'full',
	'currentReport' : null,

	'render' : function ()
	{
		var self = this;
		var data = {};
		var el = this.$el;

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
				'name' : 'Weeks',
				'token' : '7days'
			},
			{
				'name' : '28 days',
				'token' : '28days'
			}
		];

		//console.log (this.options.reports);
		el.html (Mustache.render (Templates.combinedstatistics, data));

		this.setReport (this.options.reports[0]);

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
				for (var i = 0; i < self.options.reports.length; i ++)
				{
					console.log (self.options.reports[i].getDataset ());
					self.options.reports[i].getDataset ().setInterval (interval.token);
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

		return this;
	},

	'setReport' : function (report)
	{
		this.currentReport = report;

		var div = $('<div></div>');
		this.$el.find ('.portlet-body').html (div);

		this.$el.find ('.statistic-title').html (report.get ('name'));

		report.getWidget ().innerRender (div);
	}

});