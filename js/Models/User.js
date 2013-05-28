Cloudwalkers.Models.User = Backbone.Model.extend({

	'initialize' : function ()
	{
		var accountmodels = [];
		var accounts = this.get ('accounts');

		if (accounts)
		{
			for (var i = 0; i < accounts.length; i ++)
			{
				accountmodels.push (new Cloudwalkers.Models.Account (accounts[i]));
			}

			this.set ('accountmodels', accountmodels);
		}
	},

	'getAccounts' : function ()
	{
		return this.get ('accountmodels');
	},

	'name' : function ()
	{
		return this.get ('name');
	}

});