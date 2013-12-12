Cloudwalkers.Models.Channel = Backbone.Model.extend({
	
	'endpoint' : '',
	'parameters' : '',
	
	'initialize' : function ()
	{
		// deprecated?
		this.messages = new Cloudwalkers.Collections.Messages([], {id: this.id});
		

		// add child channels and streams to collection
		Cloudwalkers.Session.setChannels(this.get("channels"));
		Cloudwalkers.Session.setStreams(this.get("streams"));
		
		//this.on("all", function(a, b){ console.log(a, b); });
		//this.on("change:streams", function(){ Cloudwalkers.Session.setStreams(this.get("streams")) });
		
	},
	
	'url' : function()
	{
		var id = this.id? this.id: "";
		
		return CONFIG_BASE_URL + 'json/channel/' + id + this.endpoint + this.parameters;
	},
	
	'parse' : function(response)
	{
		return response.channel;	
	},
	
	/**
	 *	Get Stream
	 *	Get stream by id (int) or token (string)
	 **/
	'getStream' : function(identifier)
	{
		 
		if(typeof identifier == 'string')
		{
			var identifier = identifier;
			var streams = this.get("streams").filter(function(stream){ return stream.token==identifier});
			
			if(!streams.length) return null;
			
			var id = streams.shift().id;
		}
		 
		return Cloudwalkers.Session.getStream((id)? id: identifier);

	 },
	 
	'sync' : function (method, model, options)
	{
		if(method == "read")
		{
			this.endpoint = (options.endpoint)? "/" + options.endpoint: "";
			this.parameters = (options.parameters)? "?" + $.param(options.parameters): "";
			
		} else if(method == "create")
		{
			this.endpoint = (options.parent)? options.parent + "/channels": "";  
		}

		return Backbone.sync(method, model, options);
	},
	
	'post' : function(object)
	{
		Cloudwalkers.Session.getAccount().channels.create(object, {parent: this.id, wait: true, success: function(model)
		{
			// Hack
			var channels = this.get("channels");
			channels.push(model.attributes)
			
			this.set({channels: channels}).trigger("change:channels");
			this.store();
			
		}.bind(this)});	
	},
	
	'store' : function()
	{
		Store.set("channels", this.attributes);
	},
	 
	'filterMessages' : function(filters, page, callbacks)
	 {
		// Endpoints
		// "/channel/{channelId}/messageids?streams=1,2&channels=4,5"
		// "message/?ids=14,2,3,4,5"
		
		//Cloudwalkers.Net.get("/channel/"+this.category.id+"/messageids", null, function(response){ console.log(response) })
		
		
		
		 
	 }

});