/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.ChannelCounters = Cloudwalkers.Views.Widgets.Widget.extend({

	'events' : {
		'click .portlet-title.line' : 'collapse'
	},

	'render' : function ()
	{
		var el = this.$el;

		var data = {};
		jQuery.extend (true, data, this.options.channel, this.options);

		data.message_count = data.unread;

		data.channels.sort (function (a, b)
		{
			return parseInt(b.unread) - parseInt(a.unread);
		});

		jQuery.each (data.channels, function (i, v) {
			data.channels[i].url = '#channel/' + data.channel.id + '/' + v.id;
			data.channels[i].message_count = v.unread ? v.unread : 0;
		});
		
		// Order
		data.streams.sort (function (a, b)
		{
			return parseInt(b.unread) - parseInt(a.unread);
		});

		jQuery.each (data.streams, function (i, v) {
			data.streams[i].url = '#channel/' + data.channel.id + '/0/' + v.id;
			data.streams[i].message_count = v.unread > 0 ? v.unread : 0;
		});

		el.html (Mustache.render (Templates.messagecounter, data));

		return this;
	}
});