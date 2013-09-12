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

			// Order
			data.streams.sort (function (a, b)
			{
				return a.message_count < b.message_count;
			});

			jQuery.each (data.streams, function (i, v)
			{
				data.streams[i].url = '#schedule/' + v.id;
			});

			el.html (Mustache.render (Templates.messagecounter, data));

			setTimeout (function ()
			{
				self.trigger ('content:change');
			}, 100);
		});

		return this;
	}

});