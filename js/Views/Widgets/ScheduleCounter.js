/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.ScheduleCounter = Cloudwalkers.Views.Widgets.Widget.extend({

	'render' : function ()
	{
		var el = this.$el;
		var self = this;

		el.html ('<p>Please wait, loading data.</p>');

		this.options.schedule.loadCounters (function (inputdata)
		{
			var data = {};
			jQuery.extend (true, data, inputdata.schedule, self.options);

			el.html (Mustache.render (Templates.messagecounter, data));

			setTimeout (function ()
			{
				self.trigger ('content:change');
			}, 100);
		});

		return this;
	}

});