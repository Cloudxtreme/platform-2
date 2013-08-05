Cloudwalkers.Views.Reports = Cloudwalkers.Views.Widgets.WidgetContainer.extend({

	'navclass' : 'reports',
	'title' : 'Reports',

	'initializeWidgets' : function ()
	{
		var streams = Cloudwalkers.Session.getStreams ();
		var self = this;

		for (var i = 0; i < streams.length; i ++)
		{
			this.addStreamWidgets (streams[i]);
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
					for (var j = 0; j < data.statistics.length; j ++)
					{
						var dataurl = CONFIG_BASE_URL + 'json/stream/' + stream.id + '/statistics/' + data.statistics[j];

						var widget = new Cloudwalkers.Views.Widgets.Charts.Linechart ({
							'dataurl' : dataurl,
							'title' : stream.name + ' ' + data.statistics[j]
						});
						self.addWidget (widget, true);
					}
				}
			}
		);
	}
});