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
			return parseInt(b.count.incomingUnread) - parseInt(a.count.incomingUnread);
		});
		
		// Parse
		$.each (list, function (i, v)
		{
			
			console.log(v.count.incomingUnread);
			
			data.list.push(
				{ name: v.name, url: '#' + data.type + '/' + data.channel.id + '/' + v.id, unread: v.count.incomingUnread ? v.count.incomingUnread : 0, icon: v.network? v.network.icon: data.icon }
			)
		});

		this.$el.html (Mustache.render (Templates.messagescounters, data));

		return this;
	}
});