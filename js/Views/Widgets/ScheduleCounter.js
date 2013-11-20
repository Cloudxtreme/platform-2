/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.ScheduleCounter = Cloudwalkers.Views.Widgets.Widget.extend({

	'render' : function ()
	{
		var el = this.$el;
		var self = this;

		this.$el.html('<div class="portlet portlet-loading"></div>');

		this.options.schedule.loadCounters (function (inputdata)
		{
			var data = { list: [] };
			jQuery.extend (true, data, inputdata.schedule, self.options);

			// Order
			data.streams.sort (function (a, b)
			{
				return parseInt(a.message_count) < parseInt(b.message_count);
			});

			$.each (data.streams, function (i, v)
			{
				data.list.push(
					{ name: v.customname, url: '#schedule/' + v.id, unread: v.message_count ? v.message_count : 0, icon: v.network.icon }
				)
			});

			el.html (Mustache.render (Templates.messagecounter, data));

			setTimeout (function ()
			{
				self.trigger ('content:change');
				self.negotiateFunctionalities();
			}, 100);
		});

		return this;
	}
});