Cloudwalkers.Session = 
{
	'user' : null,
	'settings' : {
		'currentAccount' : null,
		'viewMode' : null
	},

	'isLoaded' : function ()
	{
		return this.user != null;
	},
	
	'loadEssentialData' : function (callback)
	{
		this.user = new Cloudwalkers.Models.Me();

		this.user.once("change", callback);
		this.user.fetch();
	},
	
	'updateSettings' : function(user)
	{
		// Hack: solve array issue
		if(user && user.get("settings").length === 0) return null;
		
		$.extend(Cloudwalkers.Session.settings, user.get("settings"));
	},
	
	'updateSetting' : function(attribute, value, callbacks)
	{
	
		if( Cloudwalkers.Session.settings[attribute] != value)
		{
			// Update session
			Cloudwalkers.Session.settings[attribute] = value;
			
			// Update user
			Cloudwalkers.Session.user.save({settings: Cloudwalkers.Session.settings}, callbacks);
		}
	},
	
	'get' : function(attribute)
	{
		// Update session
		return Cloudwalkers.Session.settings[attribute];
	},
	
	'getUser' : function (id)
	{
		return (id)? this.user.account.users.get (id):  this.user;
	},
	
	'getUsers' : function ()
	{
		return this.user.account.users;
	},

	'getAccount' : function (id)
	{
		return (id)? this.user.accounts.get(id):  this.user.account;
	},
	
	'getAccounts' : function (id)
	{
		this.user.accounts;
	},
	
	'getChannel' : function (id)
	{
		return this.user.account.channels.get (id);
	},
	
	'getChannels' : function (id)
	{
		return this.user.account.channels;
	},
	
	'getStream' : function (id)
	{
		return this.user.account.streams.get (id);
	},
	
	'getStreams' : function ()
	{
		return this.user.account.streams;
	},

	'refresh' : function ()
	{
		this.getAccount ().refresh (function ()
		{
			Cloudwalkers.Session.trigger ('channels:change');
		});
	},
	
	'reset' : function ()
	{
		window.localStorage.clear();
	}
}

// Add events
_.extend(Cloudwalkers.Session, Backbone.Events);