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

	'url' : function ()
	{
		return CONFIG_BASE_URL + 'json/account/' + this.get ('account') + '/users/' + this.get ('id');
	},

	'getAccounts' : function ()
	{
		return this.get ('accountmodels');
	},

	'name' : function ()
	{
		return this.get ('name');
	},

	'getFunction' : function ()
	{
		if (this.get ('level') == 10)
		{
			return 'Administrator';
		}
		else
		{
			return 'User';
		}
	}

});