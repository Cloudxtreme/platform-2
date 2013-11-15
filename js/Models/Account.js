Cloudwalkers.Models.Account = Backbone.Model.extend({

	'initialize' : function ()
	{

	},

	'avatar' : function ()
	{
		return this.get ('avatar');
	},

	'channels' : function ()
	{
		var channels = this.get ('channels');
		return channels;
	},

	'channel' : function (id)
	{
		var channel = this._findChannelRecursive (this.channels (), id);
		return channel;
	},

	'getChannelFromType' : function (type)
	{
		var channels = this.channels ();
		for (var i = 0; i < channels.length; i ++)
		{
			if (channels[i].type == type)
			{
				return channels[i];
			}
		}
		return null;
	},

	'_findChannelRecursive' : function (channels, id)
	{
		for (var i = 0; i < channels.length; i ++)
		{
			if (channels[i].id == id)
			{
				//console.log (channels[i]);
				return channels[i];
			}
			else if (channels[i].channels.length > 0)
			{
				var tmp = this._findChannelRecursive (channels[i].channels, id);
                if (tmp != null)
                {
                    return tmp;
                }
			}
		}

		return null;
	},

	'streams' : function (filters)
	{
		var out = [];
		var streams = Cloudwalkers.Session.getStreams ();

		if (typeof (filters) == 'undefined')
		{
			filters = {};
		}

		for (var j = 0; j < streams.length; j ++)
		{
			if (typeof (filters.outgoing) != 'undefined')
			{
				//console.log (channels[i].streams[j].direction.OUTGOING);
				if (streams[j].get ('direction').OUTGOING == 1)
				{
					out.push (streams[j]);
				}
			}

			else if (typeof (filters.incoming) != 'undefined')
			{
				//console.log (channels[i].streams[j].direction.OUTGOING);
				if (streams[j].get ('direction').OUTGOING == 1)
				{
					out.push (streams[j]);
				}
			}

			else if (typeof (filters.statistics) != 'undefined')
			{
				if (streams[j].get ('statistics') == 1)
				{
					out.push (streams[j]);
				}
			}
		}

		// Sort on priority
		out.sort (function (a, b)
		{
			return a.priority < b.priority;
		});

		//console.log (out);
		return out;
	},

	'statisticchannels' : function ()
	{
		var streams = this.streams ({ 'statistics' : true });
		return streams;
	},

	'refresh' : function (callback)
	{
		var self = this;
		Cloudwalkers.Session.call ('account/' + this.get ('id'), null, null, function (data)
		{
			self.set (data);
			callback ();
		});
	}

});