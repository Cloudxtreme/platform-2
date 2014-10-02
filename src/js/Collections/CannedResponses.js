define(
	['backbone'],
	function (Backbone)
	{
		var CannedResponses = Backbone.Collection.extend({

			'model' : Cloudwalkers.Models.CannedResponse,
			'touched' : false,
			
			'initialize' : function()
			{
				//this.on("destroy", this.store.bind(this, "delete"));

				if( Session.user.account)
					Session.getCannedResponses().listenTo(this, "add", Session.getCannedResponses().distantAdd);
			},
			
			'url' : function()
			{
				var url = Session.api + '/streams/' + Session.getAccount ().id + ':canned/messages';
				//var url = CONFIG_BASE_URL + 'json/streams/' + Session.getAccount ().id + ':canned/messages';
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

		return CannedResponses;
});