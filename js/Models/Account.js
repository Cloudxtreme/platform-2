Cloudwalkers.Models.Account = Backbone.Model.extend({
	
	'endpoint' : "",
	
	'initialize' : function ()
	{

		// Collect Channels
		this.channels = new Cloudwalkers.Collections.Channels();
		
		// Collect Campaigns
		this.campaigns = new Cloudwalkers.Collections.Campaigns();
		
		// Prep Users collection, fetch on demand
		this.users = new Cloudwalkers.Collections.Users();
		
		// Collect streams, fetch triggered in User model
		this.streams = new Cloudwalkers.Collections.Streams();
		//this.streams.on("sync", function(e){ Cloudwalkers.Session.trigger("change:streams");})	

		// Prep global Messages collection
		this.messages = new Cloudwalkers.Collections.Messages([],{});
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
	
	'activate' : function ()
	{	
		// Load Channels
		Store.filter("channels", null, function(list){ this.channels.add((list.length)? list: this.get("channels")); }.bind(this));
		
		// Load Campaigns
		Store.filter("campaigns", null, function(list){ this.campaigns.add((list.length)? list: this.get("campaigns")); }.bind(this));
		
		// Connect ping to account
		this.ping = new Cloudwalkers.Session.Ping({id: this.id});
		
		// get extended account data
		// this.fetch();
		
		// add channels & channel streams
		//this.channels.add(this.get("channels"));
		
		/*if( Store.exists("streams"))
			Store.filter("streams", null, function(streams){ this.streams.add(streams); }.bind(this));
		
		else {
			this.channels.collectStreams();
			this.streams.fetch();	
		}*/
		
		// add campaigns
		/*Store.filter("campaigns", null, function(list){
			
			this.campaigns.add((list.length)? list: this.get("campaigns"));

		}.bind(this));*/

	}/*,
	
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