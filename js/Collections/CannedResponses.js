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
		var url = CONFIG_BASE_URL + 'json/streams/' + Cloudwalkers.Session.getAccount ().id + ':canned/messages';
		return this.parameters? url + "?" + $.param (this.parameters): url;
	},
	
	'sync' : function (method, model, options)
	{
		this.parameters = options.parameters;

		// Hack
		if(method == "update") return false;
		
		return Backbone.sync(method, model, options);
	},
	
	'parse' : function (response)
	{	
		return response.stream.messages;
	},
	
	'store' : function (action, model)
	{
		if(action == "delete")
			Store.remove("campaigns", {id: model.id});
	},

	'removecanned' : function(id)
	{
		var cannedresponse;

		$.each(this.models, function(n, canned){
			if(canned.id == id){
				cannedresponse = this.models.splice(n,1)
				return false;
			}
		}.bind(this))

		if(cannedresponse)	return cannedresponse;
	} 
});