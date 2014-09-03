/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.MessagesCounters = Cloudwalkers.Views.Widgets.Widget.extend({
	'entries' : [],
	'events' : {
		'click a[href]' : 'updatesettings'
		/*'input .input-rounded' : 'comparesuggestions',
		'click [data-contact]' : 'filtercontacts',
		'click [data-close-contact]' : 'filtercontacts',
		'click [data-streams]' : 'filterstreams',
		'click .load-more' : 'more'*/
	},
	
	'initialize' : function(options)
	{
	
		 if(!options.color) this.options.color = this.color;
		
		// The list source is either the streams or subchannels
		this.list = options.channel[options.source];
		
		if(this.list)
		for (n in this.list.models)
		{
			// Add change listeners
			this.listenTo(this.list.models[n], "change", this.render);
			this.listenTo(this.list.models[n], "change", this.negotiateFunctionalities);
			
			// Place counter
			//this.list.models[n].count = this.list.models[n].get("count")[options.countString];

			if(this.list.models[n].get("counters"))
				this.counters = this.list.models[n].get("counters").MESSAGE;
				for(k in this.counters){
					if((this.counters[k].type == "UNREAD") && (this.counters[k].interval == "TOTAL"))
						this.list.models[n].count = this.counters[k].amount;
				}
		}
	},
	
	'render' : function ()
	{
		var data = { list: [] };		
		$.extend (data, this.options);
		
		if(this.list)
		{	
			this.list.comparator = function (a, b) { return b.count - a.count }
			
			this.list.sort();
			
			this.list.each(function(model)
			{
				var attr = model.attributes;
				
				// Hack!
				if(data.typelink)	var url = data.typelink + "/" + (model.get("hasMessages")? "messages" : "notifications");
				else				var url = data.link? data.link: '#' + data.type + '/' + data.channel.id + '/' + model.id;
				
				data.list.push({ id: attr.id, name: attr.name, url: url, count: model.count, icon: attr.network ?attr.network.icon: data.icon });
			});
		}
		
		this.$el.html (Mustache.render (Templates.messagescounters, data));

		return this;
	},
	
	'updatesettings' : function (e)
	{
		// Currently streams only
		if(this.options.source != "streams") return null;

		var model = this.list.get($(e.currentTarget).data("stream"));
		var view = model.get("childtypes")[0] + "s";
		
		// Memory cloth
		var settings = Cloudwalkers.Session.viewsettings(view);
		
		// ... And store
		settings.streams = [model.id];
		Cloudwalkers.Session.viewsettings(view, settings);
		
	},
	
	'negotiateFunctionalities' : function() {
		
		// Check for scroller
		if(this.$el.find('.scroller').length) this.addScroll();
		
		// Check amountSign
		if(this.options.counter) this.appendCounter();
		
		// Check collapse option
		if(typeof this.options.open != "undefined")
			this.appendCollapseble(this.options.open);
	}
});