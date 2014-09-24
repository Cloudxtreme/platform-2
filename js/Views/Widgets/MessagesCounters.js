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
		this.collection = options.channel[options.source];
		//options.channel.on('ready', this.fill);
		this.listenToOnce(this.collection, 'sync', this.fill)

		//options.channel.fetch();
		//this.rendercounters();
	},

	/*'updatedcounters' : function(models)
	{	
		this.options.channel = models;
		this.options.channel[this.options.source].models = this.options.channel.get(this.options.source);
		
		for(n in this.options.channel[this.options.source].models){
			this.options.channel[this.options.source].models[n] = new Cloudwalkers.Models.Stream(this.options.channel[this.options.source].models[n]);
		}
		
		this.list = this.options.channel[this.options.source];
		
		this.rendercounters();
	},*/

	/*'preparelist' : function()
	{	
		if(this.collection)
		for (n in this.collection.models)
		{
			this.collection.models[n].count = 0;
			// Add change listeners
			// this.listenTo(this.list.models[n], "change", this.render);
			// this.listenTo(this.list.models[n], "change", this.negotiateFunctionalities);
			
			// Place counter
			if(this.collection.models[n].get("counters")){
				
				if(this.options.channel.get("type") == "outgoing")
					this.collection.models[n].count = this.collection.models[n].get("counters").total.scheduled.messages.total;
				else
					this.collection.models[n].count = this.collection.models[n].get("counters").recent.incoming.any.unread;
				
			} else if(this.collection.models[n].channels){	// Deprecated

				// Keyword Filters
				
				this.keywordchannels = this.list.models[n].channels.models;

				for(k in this.keywordchannels){
					this.keywordstreams = this.keywordchannels[k].streams.models;
					
					for(j in this.keywordstreams){

						if(this.keywordstreams[j].get("counters")){
							this.counters = this.keywordstreams[j].get("counters").MESSAGE;
							
							for(i in this.counters){
								// change interval to SINCEREMEMBER
								if((this.counters[i].type == "UNREAD") && (this.counters[i].interval == "TOTAL"))
									this.list.models[n].count += parseInt(this.counters[i].amount);
								
							}
						}
					}
					this.list.models[n].count = this.keywordchannels[k].streams.models.get("counters").recent.incoming.any.unread;
				}
			}
		}

		this.collection.comparator = function (a, b) { return b.count - a.count }
			
		this.collection.sort();
	},*/
	
	'render' : function ()
	{			
		this.$el.html (Mustache.render (Templates.messagescounters, this.options));
		this.$container = this.$el.find('ul.messages-container.messages-list').eq(0)

		this.fill(this.collection.models);

		// Lazy update
		//this.options.channel.fetch({remove: false})
		
		//Hack to test the collection fetch
		this.options.channel.endpoint = '/streams';
		this.collection.url = this.options.channel.url();

		this.collection.fetch({remove: false})

		return this;
	},

	'fill' : function(models)
	{
		this.$container.empty();

		for(n in this.collection.models)
		{
			var counterentry = new Cloudwalkers.Views.CounterEntry({model: this.collection.models[n], data: this.options});
			this.$container.append(counterentry.render().el);
		}
	},	
	
	'updatesettings' : function (e)
	{
		// Currently streams only
		if(this.options.source != "streams" && this.options.source != "outgoing") return null;

		var model = this.collection.get($(e.currentTarget).data("stream"));
		var view = model.get("childtypes")[0] + "s";

		if(this.options.source == 'outgoing')
			view = 'scheduled';
		
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