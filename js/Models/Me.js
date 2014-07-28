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
		//Store.set("users", response.user);
		
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
			
			// Set current user level & permissions
			this.level = Number(this.account.get("currentuser").level);

			/*this.authorized = [
				"CAMPAIGN_CREATE", 
				"CAMPAIGN_DELETE", 
				"SERVICE_CONNECT", 
				"SERVICE_DELETE", 
				"USER_INVITE", 
				"USER_DELETE", 
				"ACCOUNT_SETTINGS", 
				"GROUP_MANAGE", 
				"DASHBOARD_VIEW", 
				"MESSAGE_SEND_COWORKERS", 
				"MESSAGE_SEND_INTERNAL", 
				"MESSAGE_SEND_EXTERNAL", 
				"MESSAGE_OUT_ATTACHMENTS", 
				"MESSAGE_OUT_SCHEDULE", 
				"MESSAGE_OUT_REPEAT", 
				"MESSAGE_OUT_EDIT_OWN", 
				"MESSAGE_ACTIONS", 
				"MESSAGE_READ_INBOX_MESSAGES", 
				"MESSAGE_READ_INBOX_NOTIFICATIONS", 
				"MESSAGE_READ_DRAFTS", 
				"MESSAGE_READ_SCHEDULE", 
				"MESSAGE_READ_COMPANY", 
				"MESSAGE_ACTIONS_COMPANY", 
				"MESSAGE_READ_THIRDPARTY", 
				"MESSAGE_ACTIONS_THIRDPARTY", 
				"MESSAGE_READ_MONITORING", 
				"MESSAGE_ACTIONS_MONITORING", 
				"CHANNEL_MANAGE_ADD_MONITORING", 
				"CHANNEL_MANAGE_EDIT_MONITORING", 
				"CHANNEL_MANAGE_DELETE_MONITORING", 
				"STATISTICS_VIEW", 
				"ACCOUNT_NOTES_VIEW", 
				"ACCOUNT_NOTES_MANAGE", 
				"ACCOUNT_TAGS_VIEW", 
				"ACCOUNT_TAGS_MANAGE"
			]*/
			

			// Role permissions
			this.authorized = this.account.get("currentuser").authorized;
			this.parseauthorized();
			this.censuretokens = this.censure(this.authorized);
			
			// Call callback
			this.trigger("activated");
			//setTimeout(this.trigger, 100, 'activated');

		}.bind(this));
		
	},

	// Can perform ANY of the actions?
	'isauthorized' : function(actions)
	{	
		if(!_.isArray(actions))		return _.contains(this.authorized, actions);
		else 						return _.intersection(this.authorized, actions).length != 0;
	},

	'censure' : function(permissions)
	{	
		var censures = {};

		for(n in permissions){
			censures[permissions[n]] = true;
		}

		return censures;
	},

	'parseauthorized' : function()
	{
		if(this.isauthorized(['MESSAGE_OUT_EDIT_OWN', 'MESSAGE_ACTIONS'])) this.authorized.push('_CW_COWORKERS_VIEW');
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