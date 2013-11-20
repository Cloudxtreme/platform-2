/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.ChannelCounters = Cloudwalkers.Views.Widgets.Widget.extend({

	'render' : function ()
	{
		var data = { list: [] };
		$.extend (true, data, this.options.channel, this.options);
		
		// Order
		data.channels.sort (function (a, b)
		{
			return parseInt(b.unread) - parseInt(a.unread);
		});
		
		data.streams.sort (function (a, b)
		{
			return parseInt(b.unread) - parseInt(a.unread);
		});
		
		$.each (data.channels, function (i, v)
		{
			data.list.push(
				{ name: v.name, url: '#' + data.channel.type + '/' + data.channel.id + '/' + v.id, unread: v.unread ? v.unread : 0, icon: v.icon }
			)
		});

		$.each (data.streams, function (i, v)
		{
			data.list.push(
				{ name: v.customname, url: '#' + data.channel.type + '/' + data.channel.id + '/' + v.id, unread: v.unread ? v.unread : 0, icon: v.network.icon }
			)
		});

		this.$el.html (Mustache.render (Templates.messagecounter, data));

		return this;
	}
});