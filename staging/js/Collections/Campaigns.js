define(
	['backbone', 'Session', 'Models/Campaign'],
	function (Backbone, Session, Campaign)
	{
		var Campaigns = Backbone.Collection.extend({

			'model' : Campaign,
			
			'initialize' : function()
			{
				this.on("destroy", this.store.bind(this, "delete"));
			},
			
			'url' : function()
			{
				return Session.api + '/account/' + Session.getAccount ().id + '/campaigns'; 
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