Cloudwalkers.Collections.Channels = Backbone.Collection.extend({

	'model' : Cloudwalkers.Models.Channel,
	
	'url' : function()
	{
		return CONFIG_BASE_URL + 'json/account/' + Cloudwalkers.Session.getAccount ().id + '/channels';
	}
});