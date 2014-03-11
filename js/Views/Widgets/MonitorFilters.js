Cloudwalkers.Views.Widgets.MonitorFilters = Cloudwalkers.Views.Widgets.Widget.extend ({

	'events' : {
		'click [data-network-streams]' : 'filternetworks',
		'click [data-keyword-id]' : 'filterkeywords',
		'click .toggleall.networks.active' : 'toggleallnetworks',
		'click .toggleall.keywords.active' : 'toggleallkeywords'
	},
	
	'initialize' : function ()
    {
		this.category = this.options.category;
		this.category.childtype = "message";
		//this.keywords = this.category.channels;
		
		this.streams = [];
		
		this.category.channels.each(function(channel)
		{
			this.streams = this.streams.concat(channel.streams.models);
		}, this);
		    
        this.initializeWidget ();
    },
    
    'toggleallnetworks' : function (all)
	{
		this.filternetworks(null, true);
		this.togglefilters(all, ".network-list");
	},
	
	'toggleallkeywords' : function (all)
	{
		this.filterkeywords(null, true);
		this.togglefilters(all, ".keyword-list");
	},
	
	'togglefilters' : function(all, selector)
	{
		// Toggle streams
		this.$el.find(selector + " .filter").addClass(all? 'active': 'inactive').removeClass(all? 'inactive': 'active');
		
		// Toggle select button
		$(selector + " .toggleall").addClass(all? 'inactive': 'active').removeClass(all? 'active': 'inactive');
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
	
	/*'filter' : function (e, all)
	{
		// Check button state
		if(!all)
			all = this.button && this.button.data("streams") == $(e.currentTarget).data("streams");

		this.togglefilters(all);
		
		if(!all)
			this.button = $(e.currentTarget).addClass('active').removeClass('inactive');
		
		var streams = all? null: this.button.data("streams");
		
		if(all) this.button = false;
		
		// Fetch filtered messages
		this.model.messages.touch(this.model, streams? {records: 20, targets: streams, sort: 'asc'} : {records: 40, sort: 'asc'});
		
		return this;
	},*/

	
	'filternetworks' : function (e, all)
	{
		
		// Check button state
		if(!all)
			all = this.button && this.button.data("network-streams") == $(e.currentTarget).data("network-streams");

		this.togglefilters(all, ".network-list");
		
		if(!all)
			this.button = $(e.currentTarget).addClass('active').removeClass('inactive');
		
		var streams = all? null: String(this.button.data("network-streams")).split(" ");
		
		if(all) this.button = false;
		
		// Add ids
		if(streams) this.list.parameters.streams = streams.join(",");
		else delete this.list.parameters.streams;

		this.category.messages.touch(this.category, this.list.parameters);

		return this;
		
		/*$(e.currentTarget).toggleClass("inactive active")
		
		// Get all active channels
		var keywords = this.$el.find ('.filter.keyword-list .active');
		var keywordids = [];
		
		// if all channels are inactive
		if(!keywords.size()) return this.list.$container.empty();

		keywords.each(function(){ keywordids.push($(this).attr('data-keyword-id'))});
		
		
		// Get all active streams
		var networks = this.$el.find ('.filter.network-list .active');
		var networkids = [];
		
		// if all networks are inactive
		if(!networks.size()) return this.list.$container.empty();

		networks.each( function()
		{
			networkids = networkids.concat($(this).attr('data-network-streams').split(" "));
		});
		
		// Add filters to list
		this.list.parameters = {records: 40, channels: keywordids.join(","), streams: networkids.join(",")};

		// Fetch filtered messages
		this.category.messages.touch(this.category, this.list.parameters); //this.collection.touch(this.model, {records: 50, group: 1});
		//this.category.fetch({endpoint: "messageids", parameters: {records: 25, channels: keywordids.join(","), streams: networkids.join(",")}});
		
		return this;*/
	},
	
	'filterkeywords' : function (e, all)
	{
		// Check button state
		if(!all)
			all = this.button && this.button.data("keyword-id") == $(e.currentTarget).data("keyword-id");

		this.togglefilters(all, ".keyword-list");
		
		if(!all)
			this.button = $(e.currentTarget).addClass('active').removeClass('inactive');
		
		var channel = all? null: Number(this.button.data("keyword-id"));
		
		if(all) this.button = false;
		
		// Add ids
		if(channel) this.list.parameters.channels = channel;
		else delete this.list.parameters.channels;

		this.category.messages.touch(this.category, this.list.parameters);

		return this;
		
		
		/*$(e.currentTarget).toggleClass("inactive active")
		
		// Get all active channels
		var keywords = this.$el.find ('.filter.keyword-list .active');
		var keywordids = [];
		
		// if all channels are inactive
		if(!keywords.size()) return this.list.$container.empty();

		keywords.each(function(){ keywordids.push($(this).attr('data-keyword-id'))});
		
		
		// Get all active streams
		var networks = this.$el.find ('.filter.network-list .active');
		var networkids = [];
		
		// if all networks are inactive
		if(!networks.size()) return this.list.$container.empty();

		networks.each( function()
		{
			networkids = networkids.concat($(this).attr('data-network-streams').split(" "));
		});
		
		// Add filters to list
		this.list.parameters = {records: 40, channels: keywordids.join(","), streams: networkids.join(",")};

		// Fetch filtered messages
		this.category.messages.touch(this.category, this.list.parameters); //this.collection.touch(this.model, {records: 50, group: 1});
		//this.category.fetch({endpoint: "messageids", parameters: {records: 25, channels: keywordids.join(","), streams: networkids.join(",")}});
		
		return this;*/
	}

});