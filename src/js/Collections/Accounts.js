Cloudwalkers.Collections.Accounts = Backbone.Collection.extend({

	'model' : Cloudwalkers.Models.Account,

	'fetch' : function(method, model, options) 
	{
		return Cloudwalkers.Session.user.get("accounts");
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
				
				// Hard relaod data
				model.fetch();
			}
		}
	},

	'outdated' : function(id)
	{
		// Collection
		if(!id) return this.filter(function(model){ return model.outdated});
		
		// Update model
		var model = this.updates([id]);
	}
});