Cloudwalkers.Models.Account = Backbone.Model.extend({
	
	'typestring' : "accounts",
	
	'endpoint' : "",
	
	// Gets updated when account activates
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

		// Prep global Canned Responses collection
		//this.cannedresponses = new Cloudwalkers.Collections.CannedResponses();

		// Prep global Notes collection
		this.notes = new Cloudwalkers.Collections.Notes();

		// Prep global Notes collection
		this.tags = new Cloudwalkers.Collections.Tags();

		// Prep global Notifications collection
		this.notifications = new Cloudwalkers.Collections.Notifications();
		
		// Prep global Statistics collection
		this.statistics = new Cloudwalkers.Collections.Statistics();
		
		// Prep global Reports collection // Deprecated?
		this.reports = new Cloudwalkers.Collections.Reports();
		
		// Prep global Comments collection - deprecated
		// this.comments = new Cloudwalkers.Collections.Comments();

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
		
		// Fetch Canned Responses
		//this.cannedresponses.fetch({parameters: {records: 50}});
		
		// Load Streams (first, so channels find them)
		Store.filter("streams", null, function(list) { this.streams.add(list); }.bind(this));
		
		// Load Channels
		Store.filter("channels", null, function(list) { this.channels.add(list); }.bind(this));
		
		// Load Campaigns
		Store.filter("campaigns", null, function(list){ this.campaigns.add(list); }.bind(this));
		
		// Load Users
		Store.filter("users", null, function(list){ this.users.add(list); }.bind(this));
		
		// Load Messages
		Store.filter("messages", null, function(list){ this.messages.add(list); }.bind(this));
		
		// Load Statistics
		Store.filter("statistics", null, function(list){ this.statistics.add(list); }.bind(this));
		
		// Load Reports // Deprecated?
		Store.filter("reports", null, function(list){ this.reports.add(list); }.bind(this));
		
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
				
			Cloudwalkers.RootView.information ("Upgrade?", "You're fresh out of " + type /*type.slice(0, -1)*/ + " slots, maybe you should upgrade.");
		
			if(target)
			{
				if(typeof target == "string") target = $(target);
				target.addClass("limited").attr("disabled", true);
			}
					
			return true;
		}
		
		// Or remove
		if($("[disabled].limited").size())
		{
			$("[disabled].limited").removeClass("limited").attr("disabled", false);
			$("[data-dismiss=alert]").click();
		}
		
		return false;
	},
	
	'addcampaign' : function (name, callback)
	{
		var campaigns = this.get("campaigns");
		
		if (campaigns.map(function(c){ return c.name }).indexOf(name) < 0)
		{
			campaigns.push({name: name});
			this.save({campaigns: campaigns}, {patch: true, wait: true, success: callback});
		}
	},
	
	'removecampaign' : function (id, callback)
	{
		var campaigns = this.get("campaigns");
		
		campaigns.forEach (
			function(campaign, n) { if(campaign.id == id) campaigns.splice(n, 1)}
		);
	
		this.save({campaigns: campaigns}, {patch: true, wait: true, success: callback});
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
	}*/

});