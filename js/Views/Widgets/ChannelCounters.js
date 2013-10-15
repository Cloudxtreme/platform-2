/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.ChannelCounters = Cloudwalkers.Views.Widgets.Widget.extend({

	'events' : {
		'click .tools .expand' : 'expand',
		'click .tools .collapse' : 'collapse'
	},

	'render' : function ()
	{
		var el = this.$el;

		var data = {};
		jQuery.extend (true, data, this.options.channel, this.options);

		data.message_count = data.unread;

		//console.log (data);
		data.channels.sort (function (a, b)
		{
			console.log (a + " " + b);

			if (a == null)
				a = 0;

			if (b == null)
				b = 0;

			return parseInt(a.unread) < parseInt(b.unread);
		});

		jQuery.each (data.channels, function (i, v) {
			data.channels[i].url = '#channel/' + data.channel.id + '/' + v.id;
			data.channels[i].message_count = v.unread ? v.unread : 0;
		});
		
		// Order
		data.streams.sort (function (a, b)
		{
			if (a == null)
				a = 0;

			if (b == null)
				b = 0;

			return parseInt(a.unread) < parseInt(b.unread);
		});

		jQuery.each (data.streams, function (i, v) {
			data.streams[i].url = '#channel/' + data.channel.id + '/0/' + v.id;
			data.streams[i].message_count = v.unread > 0 ? v.unread : 0;
		});

		el.html (Mustache.render (Templates.messagecounter, data));

		return this;
	},

	'expand' : function ()
	{
		this.trigger ('view:expand');
	},

	'collapse' : function ()
	{
		this.trigger ('view:collapse');
	}

});