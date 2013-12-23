Cloudwalkers.Models.Stream = Backbone.Model.extend({

	'initialize' : function(attributes){
		
		
		// Save channel data
		//Store.set("streams", attributes);
		
		// Child messages
		this.messages = new Cloudwalkers.Collections.Messages();

		
		//this.messages = new Cloudwalkers.Collections.Messages([], {id: this.id, endpoint: "stream"});
		
		// Has reports?
		if(this.get("statistics"))
		{
			this.reports = new Cloudwalkers.Collections.Reports();
			this.reports.streamid = this.id;
		}

	},
	
	'url' : function()
	{
		var id = this.id? this.id: "";
		
		return CONFIG_BASE_URL + 'json/stream/' + id + this.endpoint + this.parameters;
	},
	
	'parse' : function(response)
	{
		Store.set("streams", response.stream);
		
		return response.stream;
	},
	
	'sync' : function (method, model, options)
	{
		if(method == "read")
		{
			this.endpoint = (options.endpoint)? "/" + options.endpoint: "";
			this.parameters = (options.parameters)? "?" + $.param(options.parameters): "";
			
		} else if(method == "create")
		{
			this.endpoint = (options.parent)? options.parent + "/streams": "";  
		}

		return Backbone.sync(method, model, options);
	}

});