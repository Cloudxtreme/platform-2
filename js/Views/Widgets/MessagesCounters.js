/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.MessagesCounters = Cloudwalkers.Views.Widgets.Widget.extend({
	'entries' : [],
	'events' : {
		'input .input-rounded' : 'comparesuggestions',
		'click [data-contact]' : 'filtercontacts',
		'click [data-close-contact]' : 'filtercontacts',
		'click [data-streams]' : 'filterstreams',
		'click .load-more' : 'more'
	},
	
	'initialize' : function(options)
	{
		 if(!options.color) this.options.color = this.color;
		
		// The list source is either the streams or subchannels
		this.list = options.channel[options.source];
		
		for (n in this.list.models)
		{
			this.listenTo(this.list.models[n], "change", this.render);
			this.listenTo(this.list.models[n], "change", this.negotiateFunctionalities);
		}
			
	},
	
	'render' : function ()
	{
		var data = { list: [] };		
		$.extend (data, this.options);
		
		this.list.comparator = function (a, b)
		{
			return (b.get("count").incomingUnread? b.get("count").incomingUnread: 0) - (a.get("count").incomingUnread? a.get("count").incomingUnread: 0);
		}
		
		this.list.sort();
		
		this.list.each(function(model)
		{
			var attr = model.attributes;
			var url = data.link? data.link: '#' + data.type + '/' + data.channel.id + '/' + model.id;
			
			data.list.push({ name: attr.name, url: url, unread: attr.count.incomingUnread ? attr.count.incomingUnread : 0, icon: attr.network ?attr.network.icon: data.icon });
		});

		this.$el.html (Mustache.render (Templates.messagescounters, data));

		return this;
	},
	
	'negotiateFunctionalities' : function() {
		
		// Check for scroller
		if(this.$el.find('.scroller').length) this.addScroll();
		
		// Check amountSign
		if(this.options.counter) this.appendCounter();
		
		// Check collapse option
		if(typeof this.options.open != "undefined")
			this.appendCollapseble(this.options.open);
	},
});