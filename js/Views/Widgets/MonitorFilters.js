Cloudwalkers.Views.Widgets.MonitorFilters = Cloudwalkers.Views.Widgets.Widget.extend ({

	'events' : {
		'click [data-network-streams]' : 'filter',
		'click [data-keyword-id]' : 'filter'
	},
	
	'initialize' : function ()
    {
		this.category = this.options.category;
		//this.keywords = this.category.channels;
		
		this.streams = [];
		
		this.category.channels.each(function(channel)
		{
			this.streams = this.streams.concat(channel.streams.models);
		}, this);
		    
        this.initializeWidget ();
    },

	'render' : function ()
	{
		var data = {keywords: this.category.channels.models};
		
		data.name = this.category.get("name");
		data.networks = Cloudwalkers.Session.getStreams().filterNetworks(this.streams, true);
		

		this.$el.html (Mustache.render (Templates.channelfilters, data));
		
		if(!data.networks.length) this.$el.find(".building-notice").toggleClass("inactive");
		
		this.listenTo(Cloudwalkers.Session, 'destroy:view', this.remove);
		
		return this;
	},
	
	'filter' : function (e)
	{
		$(e.currentTarget).toggleClass("inactive active")
		
		// Get all active channels
		var keywords = this.$el.find ('.filter.keyword-list .active');
		var keywordids = [];
		
		// if all channels are inactive, re-activate first
		if(!keywords.size())
		{
			this.$el.find ('.filter.keyword-list .inactive:first-child').toggleClass("inactive active");
			keywords = this.$el.find ('.filter.keyword-list .active');
		}
		
		keywords.each(function(){ keywordids.push($(this).attr('data-keyword-id'))});
		
		// Get all active streams
		var networks = this.$el.find ('.filter.network-list .active');
		var networkids = [];
		
		// if all networks are inactive, re-activate first
		if(!networks.size())
		{
			this.$el.find ('.filter.network-list .inactive:first-child').toggleClass("inactive active");
			networks = this.$el.find ('.filter.network-list .active');
		}

		networks.each( function()
		{
			networkids = networkids.concat($(this).attr('data-network-streams').split(","));
		});

		// Fetch filtered messages
		this.category.fetch({endpoint: "messageids", parameters: {records: 25, channels: keywordids.join(","), streams: networkids.join(",")}});
		
		return this;
	}
});