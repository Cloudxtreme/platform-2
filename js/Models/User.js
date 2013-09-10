Cloudwalkers.Models.User = Backbone.Model.extend({

	'unreadMessages' : null,

	'initialize' : function ()
	{
		var self = this;

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

		this.on ('change', function () { self.onSet () });
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
	},

	'countUnreadMessages' : function ()
	{
		var unreadmessages = 0;
		for (var j = 0; j < this.get ('accounts').length; j ++)
		{
			for (var i = 0; i < this.get ('accounts')[j].channels.length; i ++)
			{
				//console.log (this.get ('accounts')[j].channels);
				if (this.get ('accounts')[j].channels[i].type == 'inbox')
				{
					unreadmessages += parseInt(this.get ('accounts')[j].channels[i].unread);
				}
			}
		}

		return unreadmessages;
	}

	'onSet' : function ()
	{
		var unreadmessages = this.countUnreadMessages ();

		if (this.unreadmessages != unreadmessages)
		{
			this.trigger ('change:unread', unreadmessages);
		}

		this.unreadmessages = unreadmessages;
	}

});