Cloudwalkers.Models.Service = Backbone.Model.extend({
	
	'typestring' : "services",
	
	'initialize' : function ()
	{
		
	},
	
	'url' : function()
	{	
		var param = this.endpoint? "/" + this.endpoint : "";
		
		return CONFIG_BASE_URL + 'json/accounts/' + Cloudwalkers.Session.getAccount ().id + '/services/' + this.id + param;
	},
	
	'parse' : function(response)
	{	
		// A new object
		if (typeof response == "number") response = {id: response};
		
		// Debug API unlogic
		else if(response.service) response = response.service;
		
		return response;
	}
});