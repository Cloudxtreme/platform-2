 Cloudwalkers.Collections.Groups = Backbone.Collection.extend({

	'model' : Cloudwalkers.Models.Group,
	'typestring' : "groups",
	'modelstring' : "group",
	'parenttype' : "account",
	'processing' : false,

	
	'initialize' : function(options)
	{
		// Override type strings if required
		if(options) $.extend(this, options);
		
	},
	
	'parse' : function (response)
	{
		//console.log(response)
		if(this.modelstring == 'user'){
			return response.group.users;
		} else {
			return response.account.groups;
		}
	},
	
	'url' : function()
	{
		var url = [CONFIG_BASE_URL + "json"];
		
		

		if(this.modelstring == 'user'){
			
			url.push(this.parenttype + '/' + this.parentmodel.groupid);

			/*this.endpoint = this.parentmodel.modelstring;
			this.modelstring = this.parentmodel.modelstring;
			url.push(this.typestring + '/' + this.parentmodel.groupid);*/

		} else {
			url.push(this.parenttype + '/' + Cloudwalkers.Session.getAccount().id);

			if(this.typestring)
				url.push(this.typestring);
		}
		if(this.endpoint)
			url.push(this.endpoint);

		if(this.parameters)
			url.push(this.parameters);		

		url = url.join("/");

		return url;
	},
	
	'sync' : function (method, model, options)
	{
		if(method == "read")
		{
			this.processing = true;
			this.parameters = this.parameters? "?" + $.param(this.parameters): "";
		}

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