define(
	['backbone'],
	function (Backbone)
	{
		var Campaigns = Backbone.Collection.extend({

			'model' : Cloudwalkers.Models.Campaign,
			
			'initialize' : function()
			{
				this.on("destroy", this.store.bind(this, "delete"));
			},
			
			'url' : function()
			{
				return Session.api + '/account/' + Session.getAccount ().id + '/campaigns'; 
				//return CONFIG_BASE_URL + 'json/account/' + Session.getAccount ().id + '/campaigns';
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

		return Campaigns;
});