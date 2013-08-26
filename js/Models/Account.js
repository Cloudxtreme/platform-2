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
				if (streams[j].direction.OUTGOING == 1)
				{
					out.push (streams[j]);
				}
			}

			else if (typeof (filters.incoming) != 'undefined')
			{
				//console.log (channels[i].streams[j].direction.OUTGOING);
				if (streams[j].direction.OUTGOING == 1)
				{
					out.push (streams[j]);
				}
			}

			else if (typeof (filters.statistics) != 'undefined')
			{
				if (streams[j].statistics == 1)
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
	}

});