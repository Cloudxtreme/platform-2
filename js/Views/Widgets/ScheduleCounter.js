/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.ScheduleCounter = Cloudwalkers.Views.Widgets.Widget.extend({

	'innerRender' : function (el)
	{
		el.html ('<p>Please wait, loading data.</p>');

		this.options.schedule.loadCounters (function (data)
		{
			el.html (Mustache.render (Templates.channelcounters, data));
		});

		return this;
	}

});