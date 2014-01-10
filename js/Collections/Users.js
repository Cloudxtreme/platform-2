Cloudwalkers.Collections.Users = Backbone.Collection.extend({

	'model' : Cloudwalkers.Models.User,
	'processing' : false,

	'initialize' : function (models, options)
	{
		//this.filters = options.filters;
	},
	
	'url' : function()
	{
		return CONFIG_BASE_URL + 'json/account/' + Cloudwalkers.Session.getAccount ().id + '/users';
	},
	
	'parse' : function (response)
	{	
		Store.write(this.url(), [response.users]); 
		return response.users;
	},
	
	'sync' : function (method, model, options) {
		
		// Store Local
		if( method == "read")
			Store.get(this.url(), null, function(data)
			{
				if(data) this.add(data);

			}.bind(this));
		
		return Backbone.sync(method, model, options);
	},
	
	'updates' : function (ids)
	{
		for(n in ids)
		{
			var model = this.get(ids[n]);
			
			if(model)
			{
				// Store with outdated parameter
				Store.set(this.typestring, {id: ids[n], outdated: true});
				
				// Trigger active models
				model.outdated = true;
				model.trigger("outdated");
			}
		}
	},

	'outdated' : function(id)
	{
		// Collection
		if(!id) return this.filter(function(model){ return model.outdated});
		
		// Update model
		var model = this.updates([id]);
	},
	
	'hook' : function(callbacks)
	{
		if(callbacks.records) this.parameters.records = callbacks.records;
		
		
		if(!this.processing) this.fetch({error: callbacks.error});
		
		else if(this.length) callbacks.success(this);

		this.on("sync", callbacks.success);	
	}

});