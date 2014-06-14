Cloudwalkers.Models.Me = Cloudwalkers.Models.User.extend({
	
	'unreadMessages' : null,
	
	'initialize' : function (data)
	{
		// Load data
		this.once('change', this.activate);
		
		// Prevent conflicting user login
		this.on ('change:id', function(id){ if(this.previous("id")) Cloudwalkers.Session.home(); });
	},

	'url' : function ()
	{
		var param = this.endpoint?
			this.endpoint :
			(Store.exists("me")? "?include_accounts=ids": "");
		
		return CONFIG_BASE_URL + "json/user/me" + param;
	},
	
	'parse' : function (response)
	{
		// Parse first load
		if(!Store.exists("me"))
		{
			response.user = this.firstload(response.user);
		}
		
		/* Write hould be reference to user id */
		Store.write("me", [response.user]);
		Store.set("users", response.user);
		
		return response.user;
	},
	
	'sync' : function (method, model, options)
	{
		// For specific methods
		this.endpoint = (options.endpoint)? "/" + options.endpoint: false;
		
		// Caching
		if( method == "read")
			Store.get("me", null, function(data)
			{
				if(data) this.set(data);

			}.bind(this));

		return Backbone.sync(method, model, options);
	},
	
	'firstload' : function (me)
	{

		// Store accounts
		$.each(me.accounts, function(n, account)
		{
			Store.set("accounts", account);
			
		}.bind(this));
		
		// Check default account
		if(!me.settings.currentAccount)
			me.settings = {currentAccount: me.accounts[0].id};
						
		return me;
	},
	
	'activate' : function (data)
	{
		// Prevent dislodged user access
		if(!this.get("accounts").length)
			return Cloudwalkers.RootView.exception(401);
		
		// Get stored accounts
		Store.filter("accounts", null, function(accounts)
		{
			this.accounts = new Cloudwalkers.Collections.Accounts(accounts);
			
			// Set current account
			this.account = this.getCurrentAccount();
			this.account.activate();
			
			// Set current user level
			this.level = Number(this.account.get("currentuser").level);
			
			// Call callback
			this.trigger("activated");
			//setTimeout(this.trigger, 100, 'activated');

		}.bind(this));
		
	},
	
	'offline' : function ()
	{
		// If Me exists local, use when offline.
		if (Store.exists("me")) this.trigger("change");
	},
	
	'getCurrentAccount' : function()
	{
		// Get current account view
		var current = Cloudwalkers.Session.get("currentAccount");	
		
		if(!current)
		{
			current = this.accounts.at(0).id;
			this.save({settings: {currentAccount: current}});
		}

		var account = this.accounts.get(Number(current));
		
		// Emergency check, force full reload
		if(!account || !account.id)
		{	
			 this.save({settings: {currentAccount: this.accounts.at(0).id}});
			 
			 return Cloudwalkers.Session.home();
		}

		return account;
	}
});