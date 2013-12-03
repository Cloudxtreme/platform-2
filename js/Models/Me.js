Cloudwalkers.Models.Me = Cloudwalkers.Models.User.extend({
	
	'unreadMessages' : null,
	
	'initialize' : function (data)
	{
		
		this.accounts = new Cloudwalkers.Collections.Accounts();
		
		this.on ('change:accounts', this.updateAccounts);
		this.on ('change:id', Cloudwalkers.Router.home);
		this.on ('change:settings', Cloudwalkers.Session.updateSettings)
	},

	'url' : function ()
	{
		//var param = Store.exists("me")? "?include_accounts=ids": "";
		
		return CONFIG_BASE_URL + "json/user/me"; //+ param;
	},
	
	'parse' : function (response)
	{
		Store.write("me", [response.user]);
		
		return response.user;
	},
	
	'sync' : function (method, model, options)
	{
		if( method == "read")
			Store.get("me", null, function(data)
			{
				if(data) this.setFromLocal(data);

			}.bind(this));

		return Backbone.sync(method, model, options);
	},
	
	'setFromLocal' : function (data)
	{
		console.log(data);
		
		this.set(data);
	},
	
	'updateAccounts' : function (data)
	{
		
		if(!data.changed.accounts.length)
			return Cloudwalkers.RootView.exception(401);
		
		// Add Accounts
		this.accounts.add(data.changed.accounts, {merge: true});
		
		// Add Session.setting
		var current = Cloudwalkers.Session.settings.currentAccount;
		
		if( Number(current) == NaN || !this.accounts.get(current))
		{
			Cloudwalkers.Session.settings.currentAccount = current = data.changed.accounts[0].id;
			
			// Set current account
			this.account = this.accounts.get(current);
			this.account.activate();
			
			Cloudwalkers.Session.updateSetting('currentAccount', current);
		}

		// Set current user level
		this.level = Number(this.account.get("currentuser").level);
		
		Cloudwalkers.Session.trigger("change:accounts");
	},

	'countUnreadMessages' : function ()
	{
		var unreadmessages = 0;
		for (var j = 0; j < this.get ('accounts').length; j ++)
		{
			for (var i = 0; i < this.get ('accounts')[j].channels.length; i ++)
			{
				if (this.get ('accounts')[j].channels[i].type == 'inbox')
				{
					unreadmessages += parseInt(this.get ('accounts')[j].channels[i].unread);
				}
			}
		}

		return unreadmessages;
	},

	'savePassword' : function (oldpassword, newpassword, callback)
	{
		var data = {oldpassword:oldpassword, newpassword:newpassword}
		
		Cloudwalkers.Net.put ('user/me/password', {}, data, callback);
	}
});