/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.ChannelFilters = Cloudwalkers.Views.Widgets.Widget.extend ({

	'events' : {
		'change select[name=stream]' : 'changestream',
		'change select[name=channel]' : 'changechannel',
		'click [data-network-streams]' : 'changenetwork'
	},

	'render' : function ()
	{
		var self = this;
		var channel = this.options.channel;

		this.$el.html ('<p>Please wait, loading streams.</p>');

		channel.getChannels (function (subchannels)
		{
			channel.getStreams (function (streams)
			{
				var data = {};

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

	'changestream' : function ()
	{
		this.trigger ('stream:change', this.$el.find ('select[name=stream]').val ());
	},

	'changenetwork' : function (e)
	{
		$(e.currentTarget).toggleClass("inactive active")
		
		var networks = this.$el.find ('.filter .active');
		var streamids = networks.size()? networks.attr('data-network-streams').split (','): [];
		
		this.trigger ('stream:change', $.grep(streamids, function(item){ return (item); }));
	},

	'changechannel' : function ()
	{
		this.trigger ('channel:change', this.$el.find ('select[name=channel]').val ());	
	}

});