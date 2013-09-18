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
		
		// Order
		data.streams.sort (function (a, b)
		{
			return parseInt(a.unread) < parseInt(b.unread);
		});

		jQuery.each (data.streams, function (i, v) {
			data.streams[i].url = '#channel/' + data.channel.id + '/' + v.id;
		});

		for (var i = 0; i < data.streams.length; i ++)
		{
			data.streams[i].message_count = data.streams[i].unread;
		}

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