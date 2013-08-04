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
		var streams;
		var channels = this.channels ();

		if (typeof (filters) == 'undefined')
		{
			filters = {};
		}

		for (var i = 0; i < channels.length; i ++)
		{
			for (var j = 0; j < channels[i].streams.length; j ++)
			{
				if (typeof (filters.outgoing) != 'undefined')
				{
					if (channels[i].streams[j].direction.OUTGOING)
					{
						out.push (channels[i].streams[j]);
					}
				}
			}
		}

		//console.log (out);
		return out;
	}

});