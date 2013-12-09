Cloudwalkers.Collections.Campaigns = Backbone.Collection.extend({

	'model' : Cloudwalkers.Models.Campaign,
	
	'url' : function()
	{
		return CONFIG_BASE_URL + 'json/account/' + Cloudwalkers.Session.getAccount ().id + '/campaigns';
	}
});