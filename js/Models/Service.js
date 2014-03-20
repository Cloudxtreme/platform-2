Cloudwalkers.Models.Service = Backbone.Model.extend({

	'initialize' : function ()
	{
		
	},
	
	'url' : function()
	{	
		
		var param = this.endpoint? this.endpoint : "";
		
		return CONFIG_BASE_URL + 'json/accounts/' + Cloudwalkers.Session.getAccount ().id + '/services' + param;
	},
	
	'parse' : function(response)
	{	
		// A new object
		if (typeof response == "number") response = {id: response};
		
		else response = response.service;
		
		return response;
	},
});