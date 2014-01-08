Cloudwalkers.Collections.Messages = Backbone.Collection.extend({
	
	'model' : Cloudwalkers.Models.Message,
	'typestring' : "messages",
	'modelstring' : "message",
	'processing' : false,
	'parameters' : {},
	'paging' : {},
	'cursor' : false,
	
	
	'initialize' : function(options)
	{
		// Override type strings if required
		if(options) $.extend(this, options);
		
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
		// Hack
		if(this.parentmodel && !this.parenttype) this.parenttype = this.parentmodel.get("objectType");
		
		// Get parent model
		var url = (this.parentmodel)?

			CONFIG_BASE_URL + "json/" + this.parenttype + "/" + this.parentmodel.id :
			CONFIG_BASE_URL + "json/"+ this.typestring;
				
		if(this.endpoint)	url += "/" + this.endpoint;

		return this.parameters? url + "?" + $.param (this.parameters): url;
	},
	
	'parse' : function (response)
	{		
		// Solve response json tree problem
		if (this.parentmodel)
			response = response[this.parenttype];

		// Get paging
		this.setcursor(response.paging)

		return response[this.typestring];
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
		this.endpoint = this.modelstring + "ids";
		this.parameters = params;
		
		// Check for history (within ping lifetime)
		Store.get("touches", {id: this.url(), ping: Cloudwalkers.Session.getPing().cursor},
			function(response)
			{
				if (response && response.modelids.length)
				{
					this.seed(response.modelids);
					this.cursor = response.cursor;
				}
				else this.fetch({success: this.touchresponse.bind(this, this.url())});
				
			}.bind(this));
	},
	
	'touchresponse' : function(url, collection, response)
	{
		// Get ids
		var ids = response[this.parenttype][this.typestring];
		
		// Store results based on url
		Store.set("touches", {id: url, modelids: ids, cursor: this.cursor, ping: Cloudwalkers.Session.getPing().cursor});
	
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
			model = Cloudwalkers.Session.getMessage(id);
			
			this.add(model? model: {id: id});
			
			list.push(model? model: this.get(id));
			
			if(!model || !model.get("objectType") || model.outdated) return id;
		
		}, this));
		
		// Get list based on ids
		if(fresh.length)
		{
			this.endpoint = this.parentmodel? this.typestring: null;
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