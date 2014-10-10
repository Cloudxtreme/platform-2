define(['Models/User', 'Collections/Accounts'], 
	function (User, Accounts)
	{
		var Me = User.extend(
		{			
			unreadMessages : null,
			
			initialize : function (options)
			{	
				// Load data
				this.once('change', this.activate);

				// Force reload me on restart
				/*if(Store.exists("me"))
					Store.remove('me');

				if(Store.exists("channels"))
					Store.remove('channels');*/

				// Prevent conflicting user login
				this.on ('change:id', function(id){ if(this.previous("id")) Cloudwalkers.Session.home(); });
			},

			url : function ()
			{	
				var param = this.endpoint?
					this.endpoint :
					(Store.exists("me")? "?include_accounts=ids": "");
				
				return Cloudwalkers.Session.api + '/user/me' + param;
			},
			
			parse : function (response)
			{
				// Parse first load
				if(!Store.exists("me"))
				{
					response.user = this.firstload(response.user);
				}
				
				/* Write hould be reference to user id */
				Store.write("me", [response.user]);
				
				if(this.reload)	this.reload = false;

				return response.user;
			},
			
			sync : function (method, model, options)
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
			
			firstload : function (me)
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
			
			activate : function (data)
			{	
				// Prevent dislodged user access
				if(!this.get("accounts").length)
					return Router.Instance.exception(401);
				
				// Get stored accounts
				Store.filter("accounts", null, function(accounts)
				{
					this.accounts = new Accounts(accounts);
					
					// Set current account
					this.account = this.getCurrentAccount();
					
					this.account.activate();
					
					// Set current user level & permissions
					this.set('level', Number(this.account.get("currentuser").level));
					this.set('rolegroup', Number(this.account.get("currentuser").rolegroup));					

					// Role permissions
					this.authorized = this.account.get("currentuser").authorized;
					this.removerole('ACCOUNT_TAGS_VIEW');
					this.removerole('ACCOUNT_TAGS_MANAGE')

					this.parseauthorized();
					this.censuretokens = this.censure(this.authorized);			

					// Call callback
					this.trigger("activated");

				}.bind(this));
				
			},

			// Can perform ANY of the actions?
			isauthorized : function(actions)
			{	
				if(!_.isArray(actions))		return _.contains(this.authorized, actions);
				else 						return _.intersection(this.authorized, actions).length !== 0;
			},

			removerole : function(role)
			{	
				var index = this.authorized.indexOf(role);

				if(index >= 0)
					this.authorized.splice(index, index+1)
			},

			censure : function(permissions)
			{	
				var censures = {};

				for (var n in permissions){
					censures[permissions[n]] = true;
				}

				return censures;
			},

			parseauthorized : function()
			{
				if(this.isauthorized(['MESSAGE_OUT_EDIT_OWN', 'MESSAGE_ACTIONS'])) this.authorized.push('_CW_COWORKERS_VIEW');
				if(this.isauthorized([
					'MESSAGE_READ_INBOX_MESSAGES',
					'MESSAGE_READ_INBOX_NOTIFICATIONS', 
					'MESSAGE_READ_SCHEDULE', 
					'MESSAGE_READ_DRAFTS', 
					'ACCOUNT_NOTES_VIEW'
				])) this.authorized.push('_CW_INBOX_VIEW');
			},
			
			offline : function ()
			{
				Cloudwalkers.Session.reset();
				window.location = "/login.html";
				
				// If Me exists local, use when offline.
				// if (Store.exists("me")) this.trigger("change");
			},
			
			getCurrentAccount : function()
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

		return Me;
	}
);