/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.ChannelFilters = Cloudwalkers.Views.Widgets.Widget.extend ({

	'events' : {
		'click [data-network-streams]' : 'changenetwork',
		'click [data-keyword-id]' : 'changekeyword'
	},
	
	'initialize' : function ()
    {
        var streams = [];
		this.keywords = this.options.category.channels;
		
		$.each(this.keywords, function(i, keyword)
		{
			streams = streams.concat(keyword.streams);
		});
		
		this.streams = streams;        
        this.initializeWidget ();
    },

	'render' : function ()
	{
		var data = {keywords: this.keywords};
		
		data.name = this.options.category.name;
		data.networks = Cloudwalkers.Session.getStreams().filterNetworks(this.streams, true);

		this.$el.html (Mustache.render (Templates.channelfilters, data));
		
		this.listenTo(Cloudwalkers.Session, 'destroy:view', this.remove);
		
		return this;
	},

	/**
	* Bundle streams on networks
	
	'bundlestreamsonnetwork' : function (streams)
	{
		var map = {};
		
		
		
		
		for (var i = 0; i < streams.length; i ++)
		{
			if (typeof (map[streams[i].network.token]) == 'undefined')
			{
				map[streams[i].network.token] = {
					'network' : streams[i].network,
					'streams' : [ streams[i] ]
				};
			}

			else
			{
				map[streams[i].network.token].streams.push (streams[i]);
			}
		}

		var out = [];

		for (var key in map)
		{
			out.push (map[key]);
		}

		return out;
	},*/

	'changenetwork' : function (e)
	{
		/*$(e.currentTarget).toggleClass("inactive active")
		
		var networks = this.$el.find ('.filter.network-list .active');
		var networkids = '';
		
		// if all channels are inactive, re-activate first
		if(!networks.size())
		{
			this.$el.find ('.filter.network-list .inactive:first-child').toggleClass("inactive active");
			networks = this.$el.find ('.filter.network-list .active');
		}
		
		networks.each( function() {
			networkids += $(this).attr('data-network-streams');
		});
		
		this.trigger ('stream:change', $.grep(networkids.split (','), function(item){ return (item); }));*/
		
		$(e.currentTarget).toggleClass("inactive active");
		
		var networks = this.$el.find ('.filter.network-list .active');
		var networkids = [];
		
		if(!networks.size())
		{
			this.$el.find ('.filter.network-list .inactive:first-child').toggleClass("inactive active");
			networks = this.$el.find ('.filter.network-list .active');
		}
		
		networks.each( function()
		{
			networkids = networkids.concat($(this).attr('data-network-streams').split(","));
		});

		Cloudwalkers.Session.trigger ('stream:filter', networkids);
	},
	
	'changekeyword' : function (e)
	{
		/*$(e.currentTarget).toggleClass("inactive active")
		
		var keywords = this.$el.find ('.filter.keyword-list .active');
		var keywordids = [];
		
		// if all channels are inactive, re-activate first
		if(!keywords.size())
		{
			this.$el.find ('.filter.keyword-list .inactive:first-child').toggleClass("inactive active");
			keywords = this.$el.find ('.filter.keyword-list .active');
		}
		
		keywords.each(function(){ keywordids.push($(this).attr('data-keyword-id'))});

		this.trigger ('channel:change', keywordids);	*/
		
		$(e.currentTarget).toggleClass("inactive active")
		
		var keywords = this.$el.find ('.filter.keyword-list .active');
		var keywordids = [];
		
		// if all channels are inactive, re-activate first
		if(!keywords.size())
		{
			this.$el.find ('.filter.keyword-list .inactive:first-child').toggleClass("inactive active");
			keywords = this.$el.find ('.filter.keyword-list .active');
		}
		
		keywords.each(function(){ keywordids.push($(this).attr('data-keyword-id'))});

		Cloudwalkers.Session.trigger ('channel:filter', keywordids);
	}

});