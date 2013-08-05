Cloudwalkers.Views.Reports = Cloudwalkers.Views.Widgets.WidgetContainer.extend({

	'navclass' : 'reports',
	'title' : 'Reports',

	'initializeWidgets' : function ()
	{
		widget = new Cloudwalkers.Views.Widgets.Charts.Linechart ({
			'dataurl' : CONFIG_BASE_URL + 'json/stream/154/statistics/page_fans_lifetime'
		});

		
		this.addWidget (widget);
	}
});