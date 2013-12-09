Cloudwalkers.Collections.Services = Backbone.Collection.extend({

	'model' : Cloudwalkers.Models.Service,
	
	'url' : function()
	{
		return CONFIG_BASE_URL + 'json/account/' + Cloudwalkers.Session.getAccount ().id + '/service';
	}
});