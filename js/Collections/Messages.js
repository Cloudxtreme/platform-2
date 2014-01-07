Cloudwalkers.Collections.Messages = Backbone.Collection.extend({
	
	'model' : Cloudwalkers.Models.Message,
	'processing' : false,
	'parameters' : {},
	'paging' : {},
	'cursor' : false,
	
	'initialize' : function()
	{
		// Put "add" listener to global messages collection
		if( Cloudwalkers.Session.user.account)
			Cloudwalkers.Session.getMessages().listenTo(this, "add", Cloudwalkers.Session.getMessages().distantAdd)
	},
	
	'distantAdd' : function(model)
	{
		if(!this.get(model.id)) this.add(model);	
	},
	
	'url' : function(a)
	{
		// Get parent model
		var url = (this.parentmodel)?

			CONFIG_BASE_URL + "json/" + this.parentmodel.get("objectType") + "/" + this.parentmodel.id :
			CONFIG_BASE_URL + "json/messages";
				
		if(this.endpoint)	url += "/" + this.endpoint;

		return this.parameters? url + "?" + $.param (this.parameters): url;
	},
	
	'parse' : function (response)
	{
		// Solve response json tree problem
		if (this.parentmodel)
			response = response[this.parentmodel.get("objectType")];
			
		// Get paging
		this.setcursor(response.paging)

		return response.messages;
	},
	
	'sync' : function (method, model, options) {
		
		this.processing = true;
		
		return Backbone.sync(method, model, options);
	},
	
	'setcursor' : function (paging) {
		
		// Without paging, it's a messages call (ignore)
		if(!paging) return false;

		this.cursor = paging.cursors? paging.cursors.after: false;
	},
	
	'touch' : function(model, params)
	{
		// Work data
		this.parentmodel = model;
		this.endpoint = model.childtype + "ids";
		this.parameters = params;
		
		// Check for history (within ping lifetime)
		Store.get("touches", {id: this.url(), ping: Cloudwalkers.Session.getPing().cursor},
			function(response)
			{
				if (response && response.messageids.length)
				{
					this.seed(response.messageids);
					this.cursor = response.cursor;
				}
				else this.fetch({success: this.touchresponse.bind(this, this.url())});
				
			}.bind(this));
	},
	
	'touchresponse' : function(url, collection, response)
	{
		// Get ids
		var ids = response[this.parentmodel.get("objectType")].messages;
		
		// Store results based on url
		Store.set("touches", {id: url, messageids: ids, cursor: this.cursor, ping: Cloudwalkers.Session.getPing().cursor});
	
		// Seed ids to collection
		this.seed(ids);
	},
	
	'seed' : function(ids)
	{
		// Ignore empty id lists
		if(!ids) ids = [];

		var list = [];
		var fresh = _.compact( ids.map(function(id)
		{
			message = Cloudwalkers.Session.getMessage(id);
			
			this.add(message? message: {id: id});
			
			list.push(message? message: this.get(id));
			
			if(!message || !message.get("objectType") || message.outdated) return id;
		
		}, this));
		
		// Get list based on ids
		if(fresh.length)
		{
			this.endpoint = this.parentmodel? this.parentmodel.childtype + "s": null;
			this.parameters = {ids: fresh.join(",")};
			
			this.fetch();
		}
		
		// Trigger listening models
		this.trigger("seed", list);

		return list;
	},
	
	'more' : function(model, params)
	{
		if(!this.cursor) return false;
		
		params.after = this.cursor;
		this.touch(model, params)
		
		return this;
	}
});