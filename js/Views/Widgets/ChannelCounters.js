/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.ChannelCounters = Cloudwalkers.Views.Widgets.Widget.extend({

	'render' : function ()
	{
		var el = this.$el;

		var data = {};
		jQuery.extend (true, data, this.options.channel);

		data.message_count = data.unread;

		for (var i = 0; i < data.streams.length; i ++)
		{
			data.streams[i].message_count = data.streams[i].unread;
		}

		el.html (Mustache.render (Templates.messagecounter, data));

		return this;
	}

});