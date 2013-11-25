Cloudwalkers.Collections.Accounts = Backbone.Collection.extend({

	'model' : Cloudwalkers.Models.Account,

	'fetch' : function(method, model, options) 
	{
		return Cloudwalkers.Session.user.get("accounts");
	}
});