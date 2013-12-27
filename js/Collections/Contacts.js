Cloudwalkers.Collections.Contacts = Cloudwalkers.Collections.Users.extend({

	'model' : Cloudwalkers.Models.Contact,
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
	
	'url' : function()
	{
		return CONFIG_BASE_URL + 'json/account/' + Cloudwalkers.Session.getAccount ().id + '/contacts' + this.parameters;
	},
	
	'parse' : function (response)
	{	
		this.parameters = "";
		this.processing = false;
		
		return response.account.contacts;
	},
	
	'distantAdd' : function(model)
	{
		if(!this.get(model.id)) this.add(model);	
	},
	
	'sync' : function (method, model, options)
	{
		if(method == "read")
		{
			this.processing = true;
			this.parameters = (options.parameters)? "?" + $.param(options.parameters): "";
		}

		return Backbone.sync(method, model, options);
	}
});