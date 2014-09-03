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
	{}
	
});