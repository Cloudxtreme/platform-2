/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.MessagesCounters = Cloudwalkers.Views.Widgets.Widget.extend({

	'render' : function ()
	{
		var data = { list: [] };		
		$.extend (data, this.options);
		
		// The list source is either the substreams or subchannels
		var list = data.channel[data.source];
		
		list.comparator = function (a, b)
		{
			return (b.get("count").incomingUnread? b.get("count").incomingUnread: 0) - (a.get("count").incomingUnread? a.get("count").incomingUnread: 0);
		}
		
		list.sort();
		
		list.each(function(el)
		{
			var attr = el.attributes;
			var url = '#' + data.type + '/' + data.channel.id + '/' + el.id;
			
			data.list.push({ name: attr.name, url: url, unread: attr.count.incomingUnread ? attr.count.incomingUnread : 0, icon: attr.network ?attr.network.icon: data.icon });
		});
		
		/*
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
		});*/

		this.$el.html (Mustache.render (Templates.messagescounters, data));

		return this;
	}
});