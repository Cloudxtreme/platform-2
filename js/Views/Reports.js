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
			CONFIG_BASE_URL + 'json/stream/' + stream.get ('id') + '/statistics',
			{
				'success' : function (data)
				{
					if (data.statistics.length > 0)
					{
						// Title
						var title = new Cloudwalkers.Views.Widgets.Title ({ 'title' : stream.attributes.customname });
						self.addWidget (title, true);

						self.half = true;

						for (var j = 0; j < data.statistics.length; j ++)
						{
							self.addReportWidget (stream.attributes, data.statistics[j]);
						}
					}
				}
			}
		);
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
	}
});