Cloudwalkers.Collections.Campaigns = Backbone.Collection.extend({

	'model' : Cloudwalkers.Models.Campaign,
	
	'initialize' : function()
	{
		this.on("destroy", this.store.bind(this, "delete"));
	},
	
	'url' : function()
	{
		return CONFIG_BASE_URL + 'json/account/' + Cloudwalkers.Session.getAccount ().id + '/campaigns';
	},
	
	'parse' : function (response)
	{
		return response.campaigns;
	},
	
	'store' : function (action, model)
	{
		if(action == "delete")
			Store.remove("campaigns", {id: model.id});
	}
});