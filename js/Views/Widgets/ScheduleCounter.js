/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.ScheduleCounter = Cloudwalkers.Views.Widgets.Widget.extend({

	'innerRender' : function (el)
	{
		var self = this;

		el.html ('<p>Please wait, loading data.</p>');

		this.options.schedule.loadCounters (function (data)
		{
			el.html (Mustache.render (Templates.schedulecounter, data.schedule));

			setTimeout (function ()
			{
				self.trigger ('content:change');
			}, 100);
		});

		return this;
	}

});