Cloudwalkers.Models.Account = Backbone.Model.extend({
	
	'initialize' : function ()
	{
		// Collect streams, fetch triggered in User model
		this.streams = new Cloudwalkers.Collections.Streams();
		this.streams.on("sync", function(e){ Cloudwalkers.Session.trigger("change:streams");})	
		
		// Collect Channel
		this.channels = new Cloudwalkers.Collections.Channels();
		
		// Prep Users collection, fetch on demand
		this.users = new Cloudwalkers.Collections.Users();
		
		// Listen to account changes
		//this.on("change", )
	},
	
	'activate' : function ()
	{	
		// add from Account.channels
		this.channels.add(this.get("channels"));
		
		// Fetch Account streams
		this.streams.fetch();
		
		// Connect ping to account
		this.ping = new Cloudwalkers.Session.Ping({id: this.id});
	},
	
	'avatar' : function ()
	{
		return this.get ('avatar');
	},

	'getChannels' : function ()
	{
		return this.channels.models;
	},

	'getChannel' : function (id)
	{
		var channel = this._findChannelRecursive (this.getChannels (), id);
		return channel;
	},

	'getChannelFromType' : function (type)
	{
		return Cloudwalkers.Session.getAccount().channels.findWhere({type: type});
	},

	'_findChannelRecursive' : function (channels, id)
	{
		for (var i = 0; i < channels.length; i ++)
		{
			if (channels[i].id == id)
			{
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
	
	'refresh' : function (callback)
	{
		var self = this;
		Cloudwalkers.Net ('account/' + this.get ('id'), null, function (data)
		{
			self.set (data);
			callback ();
		});
	},
	
	'save' : function (callback)
	{
		var data = {name: this.get("name")}
		
		Cloudwalkers.Net.put ('account/' + this.id, {}, data, callback);
	}

});