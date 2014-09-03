Cloudwalkers.Models.Service = Backbone.Model.extend({
	
	'typestring' : "services",
	
	'initialize' : function (options)
	{

	},
	
	'url' : function()
	{	
		var url = [Cloudwalkers.Session.api];
		
		if(this.parentpoint)	url.push("accounts", Cloudwalkers.Session.getAccount ().id);
		if(this.typestring)		url.push(this.typestring);		
		if(this.id)				url.push(this.id);
		if(this.endpoint)		url.push(this.endpoint);
		
		return url.join("/");
	},
	
	'parse' : function(response)
	{	
		// A new object
		if (typeof response == "number") response = {id: response};
		
		// Debug API unlogic
		else if(response.service) response = response.service;
		
		return response;
	},
	
	'sync' : function (method, model, options)
	{
		options.headers = {
            'Authorization': 'Bearer ' + Cloudwalkers.Session.authenticationtoken,
            'Accept': "application/json"
        };
		
		this.endpoint = (options.endpoint)? options.endpoint: false;
		
		if(options.hasOwnProperty("parentpoint"))
			this.parentpoint = model.parentpoint
		else
			this.parentpoint = method != "delete";
		
		return Backbone.sync(method, model, options);
	},
	
	updateStreams : function (active)
	{
		this.once('sync', this.parseStreamChanges)
			.fetch({parentpoint: false});
	},
	
	parseStreamChanges : function (service)
	{
		var streams = new Cloudwalkers.Collections.Streams();
		var ids = [];
		
		service.get('streams').forEach(function(entry)
		{
			var stream = Cloudwalkers.Session.getStream(entry.id);
			
			// Active stream
			if (entry.available && !stream) ids.push(entry.id);
			
			// Inactive stream
			else if (!entry.available && stream) Cloudwalkers.Session.getStream(entry.id).silentRemove();
		});
		
		if(ids) streams.fetch({data: {ids: ids}});
	}
	
});