/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.ChannelFilters = Cloudwalkers.Views.Widgets.Widget.extend ({

	'events' : {
		'click [data-network-streams]' : 'changenetwork',
		'click [data-keyword-id]' : 'changekeyword'
	},

	'render' : function ()
	{
		var self = this;
		var channel = this.options.channel;

		var data = {};
		data.name = this.options.name;

		channel.getChannels (function (subchannels)
		{
			channel.getStreams (function (streams)
			{
				data.streams = streams;
				data.channels = subchannels;
				data.networks = self.bundlestreamsonnetwork (streams);

				self.$el.html (Mustache.render (Templates.channelfilters, data));

				return this;
			}, true);
		});

		return this;
	},

	/**
	* Bundle streams on networks
	*/
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
	},

	'changenetwork' : function (e)
	{
		$(e.currentTarget).toggleClass("inactive active")
		
		var networks = this.$el.find ('.filter.network-list .active');
		
		// if all channels are inactive, re-activate first
		if(!networks.size())
		{
			this.$el.find ('.filter.network-list .inactive:first-child').toggleClass("inactive active");
			networks = this.$el.find ('.filter.network-list .active');
		}
		
		var streamids = networks.attr('data-network-streams').split (',');
		
		this.trigger ('stream:change', $.grep(streamids, function(item){ return (item); }));
	},
	
	'changekeyword' : function (e)
	{
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

		this.trigger ('channel:change', keywordids);	
	}

});