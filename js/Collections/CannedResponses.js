Cloudwalkers.Collections.CannedResponses = Backbone.Collection.extend({

	'model' : Cloudwalkers.Models.CannedResponse,
	'touched' : false,
	
	'initialize' : function()
	{
		//this.on("destroy", this.store.bind(this, "delete"));

		if( Cloudwalkers.Session.user.account)
			Cloudwalkers.Session.getCannedResponses().listenTo(this, "add", Cloudwalkers.Session.getCannedResponses().distantAdd);
	},
	
	'url' : function()
	{
		return CONFIG_BASE_URL + 'json/streams/' + Cloudwalkers.Session.getAccount ().id + ':canned/messages';
	},
	
	'parse' : function (response)
	{	
		return response.stream.messages;
	},
	
	'store' : function (action, model)
	{
		if(action == "delete")
			Store.remove("campaigns", {id: model.id});
	}
});