/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.MessagesCounters = Cloudwalkers.Views.Widgets.Widget.extend({

	'render' : function ()
	{
		var data = { list: [] };		
		$.extend (data, this.options);
		
		// The list source is either the substreams or subchannels
		if(data.source)
			var list = data.channel.get(data.source);
		
		// Order
		list.sort (function (a, b)
		{
			return (b.count.incomingUnread? b.count.incomingUnread: 0) - (a.count.incomingUnread? a.count.incomingUnread: 0);
		});
		
		// Parse
		$.each (list, function (i, v)
		{
			data.list.push(
				{ name: v.name, url: '#' + data.type + '/' + data.channel.id + '/' + v.id, unread: v.count.incomingUnread ? v.count.incomingUnread : 0, icon: v.network? v.network.icon: data.icon }
			)
		});

		this.$el.html (Mustache.render (Templates.messagescounters, data));

		return this;
	}
});