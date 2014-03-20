Cloudwalkers.Models.Service = Backbone.Model.extend({

	'initialize' : function ()
	{
		
	},
	
	'url' : function()
	{	
		
		var param = this.endpoint? this.endpoint : "";
		
		return CONFIG_BASE_URL + 'json/accounts/' + Cloudwalkers.Session.getAccount ().id + '/services' + param;
	}
});