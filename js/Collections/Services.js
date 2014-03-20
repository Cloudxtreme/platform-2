Cloudwalkers.Collections.Services = Backbone.Collection.extend({

	'model' : Cloudwalkers.Models.Service,
	'endpoint' : "",
	
	'parse' : function (response)
	{
		// Hold available endpoint contained
		if(response.services)
		{
			// Store
			this.available = response.services.available;
			this.trigger("available:ready", this, response.services.available);

		} else return response.accounts.services;
		
	},
	
	'url' : function()
	{	
		return CONFIG_BASE_URL + 'json/accounts/' + Cloudwalkers.Session.getAccount ().id + '/services' + this.endpoint;
	},
	
	'sync' : function (method, model, options)
	{
		this.endpoint = (options.endpoint)? "/" + options.endpoint: false;
		
		return Backbone.sync(method, model, options);
	},
	
	'fetchAvailable' : function (options)
	{
		this.fetch({endpoint: "available"});
	}
});