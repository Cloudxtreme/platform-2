Cloudwalkers.Models.Channel = Backbone.Model.extend({
	
	'endpoint' : '',
	
	'initialize' : function ()
	{
		this.messages = new Cloudwalkers.Collections.Messages([], {id: this.id});
		

		// add child channels and streams to collection
		Cloudwalkers.Session.setChannels(this.get("channels"));
		Cloudwalkers.Session.setStreams(this.get("streams"));
		
		
		//this.on("all", function(a, b){ console.log(a, b); });
		
		//this.on("change:streams", function(){ Cloudwalkers.Session.setStreams(this.get("streams")) });
		
	},
	
	'url' : function()
	{
		var param = (this.parameters)? "?"+ $.param(this.parameters): "";
		
		console.log(param)
		
		return CONFIG_BASE_URL + 'json/channel/' + this.id + this.endpoint + param;
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
		this.endpoint = (options.endpoint)? "/" + options.endpoint: "";
		this.parameters = (options.parameters)? options.parameters: null;

		return Backbone.sync(method, model, options);
	},
	 
	'filterMessages' : function(filters, page, callbacks)
	 {
		// Endpoints
		// "/channel/{channelId}/messageids?streams=1,2&channels=4,5"
		// "message/?ids=14,2,3,4,5"
		
		//Cloudwalkers.Net.get("/channel/"+this.category.id+"/messageids", null, function(response){ console.log(response) })
		
		
		
		 
	 }

});