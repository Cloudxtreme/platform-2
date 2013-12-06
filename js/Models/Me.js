Cloudwalkers.Models.Me = Cloudwalkers.Models.User.extend({
	
	'unreadMessages' : null,
	
	'initialize' : function (data)
	{
		this.accounts = new Cloudwalkers.Collections.Accounts();
		
		//this.on ('change:settings', Cloudwalkers.Session.updateSettings)
		this.on ('change:accounts', this.setAccounts);
		//this.on ('change:id', Cloudwalkers.Session.reset);
		this.on ('change:id', Cloudwalkers.Router.home);
		
	},

	'url' : function ()
	{
		var param = Store.exists("me")? "?include_accounts=ids": "";
		
		return CONFIG_BASE_URL + "json/user/me" + param;
	},
	
	'parse' : function (response)
	{
		if(!Store.exists("me"))
		{
			response.user = this.firstLoad(response.user);
		}
		
		Store.write("me", [response.user]);
		
		return response.user;
	},
	
	'firstLoad' : function (me)
	{
		// store and simplify accounts
		for(n in me.accounts)
		{
			Store.post("accounts", me.accounts[n]);
			
			me.accounts[n] = me.accounts[n].id;
		}

		// Add current account if non-existant
		if(!me.settings.currentAccount) me.settings = {currentAccount: me.accounts[0]};

		return me;
	},
	
	'sync' : function (method, model, options)
	{
		if( method == "read")
			Store.get("me", null, function(data)
			{
				if(data) this.set(data);

			}.bind(this));

		return Backbone.sync(method, model, options);
	},
	
	'setAccounts' : function (data)
	{
		
		// Prevent dislodged user access
		if(!this.get("accounts").length)
			return Cloudwalkers.RootView.exception(401);
		
		Store.filter("accounts", null, function(accounts){ this.accounts.add(accounts); }.bind(this));
		
		var current = Cloudwalkers.Session.get("currentAccount");
		setTimeout( function(){ Cloudwalkers.Session.get("currentAccount") },100);
		
		// Set current account
		this.account = this.getCurrentAccount();
		this.account.activate();

		// Set current user level
		this.level = Number(this.account.get("currentuser").level);

	},
	
	'getCurrentAccount' : function()
	{
		var current = Cloudwalkers.Session.get("currentAccount");
		
		console.log(this.attributes.accounts)
		
		if(!current)
		{
			current = this.attributes.accounts[0].id? this.attributes.accounts[0].id: this.attributes.accounts[0];
			this.save({settings: {currentAccount: current}});
		} 
		
		return this.accounts.get(current);
	},

	'savePassword' : function (oldpassword, newpassword, callback)
	{
		var data = {oldpassword:oldpassword, newpassword:newpassword}
		
		Cloudwalkers.Net.put ('user/me/password', {}, data, callback);
	}
});