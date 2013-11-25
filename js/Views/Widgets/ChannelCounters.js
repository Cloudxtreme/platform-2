/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.ChannelCounters = Cloudwalkers.Views.Widgets.Widget.extend({

	'render' : function ()
	{
		var data = { list: [] };
		$.extend (data, this.options);
		
		var streams = data.channel.get("streams");
		var channels = data.channel.get("channels");
		
		// Order
		channels.sort (function (a, b)
		{
			return parseInt(b.unread) - parseInt(a.unread);
		});
		
		streams.sort (function (a, b)
		{
			return parseInt(b.unread) - parseInt(a.unread);
		});
		
		$.each (channels, function (i, v)
		{
			data.list.push(
				{ name: v.name, url: '#' + data.type + '/' + data.channel.id + '/' + v.id, unread: v.unread ? v.unread : 0, icon: v.icon }
			)
		});

		$.each (streams, function (i, v)
		{
			data.list.push(
				{ name: v.customname, url: '#' + data.type + '/' + data.channel.id + '/' + v.id, unread: v.unread ? v.unread : 0, icon: v.network.icon }
			)
		});

		this.$el.html (Mustache.render (Templates.messagecounter, data));

		return this;
	}
});