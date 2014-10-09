define(
	['Collections/BaseCollection', 'Session', 'Models/Campaign'],
	function (BaseCollection, Session, Campaign)
	{
		var Campaigns = BaseCollection.extend({

			model : Campaign,
			
			initialize : function()
			{
				this.on("destroy", this.store.bind(this, "delete"));
			},
			
			url : function()
			{
				return Session.api + '/account/' + Session.getAccount ().id + '/campaigns'; 
			},
			
			parse : function (response)
			{
				return response.campaigns;
			},
			
			store : function (action, model)
			{
				if(action == "delete")
					Store.remove("campaigns", {id: model.id});
			}
		});

		return Campaigns;
});