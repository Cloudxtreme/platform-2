Cloudwalkers.Collections.Contacts = Cloudwalkers.Collections.Users.extend({

	'model' : Cloudwalkers.Models.Contact,
	'typestring' : "contacts",
	'modelstring' : "contact",
	'comparator' : 'displayname',
	'processing' : false,

	'initialize' : function (models, options)
	{
		// Global collection gets created before session build-up
		if( Cloudwalkers.Session.user.account)
		{
			Cloudwalkers.Session.getContacts().listenTo(this, "add", Cloudwalkers.Session.getContacts().distantAdd);
		}
	},
	
	'sync' : function (method, model, options)
	{
		if(method == "read")
		{
			this.processing = true;
			this.parameters = (options.parameters)? "?" + $.param(options.parameters): "";
		}

		return Backbone.sync(method, model, options);
	},
	
	'updates' : function (ids)
	{
		for(n in ids)
		{
			var model = this.get(ids[n]);
			
			if(model && model.get("objectType"))
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
	}
});