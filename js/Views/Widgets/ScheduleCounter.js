/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.ScheduleCounter = Cloudwalkers.Views.Widgets.Widget.extend({

	'events' : {
		'click .tools .expand' : 'expand',
		'click .tools .collapse' : 'collapse'
	},

	'render' : function ()
	{
		var el = this.$el;
		var self = this;

		this.$el.html('<div class="portlet portlet-loading"></div>');

		this.options.schedule.loadCounters (function (inputdata)
		{
			var data = {};
			jQuery.extend (true, data, inputdata.schedule, self.options);

			// Order
			data.streams.sort (function (a, b)
			{
				return parseInt(a.message_count) < parseInt(b.message_count);
			});

			jQuery.each (data.streams, function (i, v)
			{
				data.streams[i].url = '#schedule/' + v.id;
			});

			el.html (Mustache.render (Templates.messagecounter, data));

			setTimeout (function ()
			{
				self.trigger ('content:change');
				self.negotiateFunctionalities();
			}, 100);
		});

		return this;
	}/*,

	'expand' : function ()
	{
		this.trigger ('view:expand');
	},

	'collapse' : function ()
	{
		this.trigger ('view:collapse');
	}*/

});