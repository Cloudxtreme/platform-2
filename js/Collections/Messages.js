Cloudwalkers.Collections.Messages = Backbone.Collection.extend({
	
	'model' : Cloudwalkers.Models.Message,
	'processing' : false,
	
	'initialize' : function(list, options)
	{
		this.parentid = options.id? options.id: null;
		this.endpoint = options.endpoint? options.endpoint: "channel";
		
		this.parameters = {
			records : options.records? options.records: 20,
			page : options.page? options.page: 1
		}
	},
	
	'url' : function()
	{
		if(this.endpoint && this.parentid)
			 
			 return CONFIG_BASE_URL + "json/" + this.endpoint + "/" + this.parentid + "/messages?" + $.param (this.parameters);
		else return CONFIG_BASE_URL + "json/message?" + $.param (this.parameters);
	},
	
	'parse' : function (response)
	{
		if(response.stream) return response.stream.messages;
		if(response.channel) return response.channel.messages;
		if(response.messages) return response.messages;
	},
	
	'sync' : function (method, model, options) {
		
		this.processing = true;
		
		return Backbone.sync(method, model, options);
	},
	
	'seed' : function(ids)
	{
		
		var fresh = [];
		
		for(n in ids)
		{
			message = this.add({id: ids[n]});
			
			if(!message.get("date") || message.outdated) fresh.push(ids[n]);
		}
		
		// Get list based on ids
		this.parameters = {ids: fresh.join(",")};
		this.fetch();
		
		// Clean the parameters
		this.parameters = {};
			
	},
	
	'hook' : function(callbacks)
	{
		if(callbacks.records) this.parameters.records = callbacks.records;
		
		
		if(!this.processing) this.fetch({error: callbacks.error});
		
		else if(this.length) callbacks.success(this);

		this.on("sync", callbacks.success);	
	},
	
	'next' : function (params)
	{
		this.parameters.page ++;
		this.fetch(params);
	}
});