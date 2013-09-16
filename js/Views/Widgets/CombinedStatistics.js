Cloudwalkers.Views.Widgets.CombinedStatistics = Cloudwalkers.Views.Widgets.Widget.extend ({

	'size': 'full',

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
				'token' : 'days'
			},
			{
				'name' : 'Weeks',
				'token' : 'weeks'
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
		function attachEvent (report)
		{
			//console.log ('[data-report-id="' + report.get ('uniqueid') + '"]');
			el.find ('[data-report-id="' + report.get ('uniqueid') + '"]').click (function ()
			{
				self.setReport (report);
			});
		}

		for (var i = 0; i < this.options.reports.length; i ++)
		{
			attachEvent (this.options.reports[i]);
		}

		return this;
	},

	'setReport' : function (report)
	{
		var div = $('<div></div>');
		this.$el.find ('.portlet-body').html (div);

		this.$el.find ('.statistic-title').html (report.get ('name'));

		report.getWidget ().innerRender (div);
	}

});