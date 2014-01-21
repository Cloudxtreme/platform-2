Cloudwalkers.Models.Account = Backbone.Model.extend({
	
	'endpoint' : "",
	
	'limits' : {users: 50, networks: 15, keywords: 10},
	
	'initialize' : function ()
	{
		// Collect Channels
		this.channels = new Cloudwalkers.Collections.Channels();
		
		// Collect streams, fetch triggered in User model
		this.streams = new Cloudwalkers.Collections.Streams();
		
		// Collect Campaigns
		this.campaigns = new Cloudwalkers.Collections.Campaigns();
		
		// Prep Users collection, fetch on demand
		this.users = new Cloudwalkers.Collections.Users();
		
		// Prep Contacts collection, fetch on demand
		this.contacts = new Cloudwalkers.Collections.Contacts();

		// Prep global Messages collection
		this.messages = new Cloudwalkers.Collections.Messages();
		
		// Prep global Notifications collection
		this.notifications = new Cloudwalkers.Collections.Notifications();
		
		// Prep global Reports collection
		this.reports = new Cloudwalkers.Collections.Reports();
		
		// Prep global Comments collection - deprecated
		this.comments = new Cloudwalkers.Collections.Comments();
	},
	
	'parse' : function (response)
	{
		this.endpoint = "";
		
		Store.set("accounts", response.account);
		
		return response.account;
	},
	
	'url' : function ()
	{		
		return CONFIG_BASE_URL + 'json/account/' + this.id + this.endpoint;
	},
	
	'sync' : function (method, model, options)
	{
		this.endpoint = (options.endpoint)? "/" + options.endpoint: "";

		return Backbone.sync(method, model, options);
	},
	
	'firstload' : function()
	{
		// Store channels and their children
		$.each(this.get("channels"), function(n, channel){ Cloudwalkers.Session.storeChannel(channel); });
	},
	
	'activate' : function ()
	{	
		// First load
		if(!Store.exists("channels")) this.firstload();
		
		// Load Streams (first, so channels find them)
		Store.filter("streams", null, function(list){ this.streams.add(list); }.bind(this));
		
		// Load Channels
		Store.filter("channels", null, function(list){ this.channels.add(list); }.bind(this));
		
		// Load Campaigns
		Store.filter("campaigns", null, function(list){ this.campaigns.add(list); }.bind(this));
		
		// Load Messages
		Store.filter("messages", null, function(list){ this.messages.add(list); }.bind(this));
		
		// Filter limits
		if( this.get("plan"))
			this.limits = this.get("plan").limits;
		
		// Connect ping to account
		this.ping = new Cloudwalkers.Session.Ping({id: this.id});

	},
	
	'monitorlimit' : function(type, current, target)
	{
		if(current >= this.limits[type])
		{
			$('.alert-info').remove();
				
			Cloudwalkers.RootView.information ("Upgrade?", "You're fresh out of " + type.slice(0, -1) + " slots, maybe you should upgrade.");
		
			if(target)
			{
				if(typeof target == "string") target = $(target);
				target.addClass("limited").attr("disabled", true);
			}

					
			return true;
		}
		
		return false;
	}
	
	/*'monitorlimit' : function(type, current, target)
	{
		if(current >= this.limits[type])
		{
			setTimeout(function(type, target)
			{
				$('.alert-info').remove();
				
				Cloudwalkers.RootView.information ("Upgrade?", "You're fresh out of " + type.slice(0, -1) + " slots, maybe you should upgrade.");
			
				if(target)
				{
					if(typeof target == "string") target = $(target);
					target.addClass("limited").attr("disabled", true);
				}
	
			}, 50, type, target);
					
			return true;
		}
		
		return false;
	}*/
	/*,
	
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
	}*/

});