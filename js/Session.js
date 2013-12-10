Cloudwalkers.Session = 
{
	'user' : null,
	/*'settings' : {
		'currentAccount' : null,
		'viewMode' : null
	},*/

	'isLoaded' : function ()
	{
		return this.user != null;
	},
	
	'loadEssentialData' : function (callback)
	{
		this.user = new Cloudwalkers.Models.Me();

		this.user.once("activated", callback);
		this.user.fetch();
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
	},
	
	'home' : function()
	{
		Cloudwalkers.Router.Instance.home();	
	},
	
	/**
	 *	Session settings functions
	 **/
	
	/*'updateSettings' : function(user)
	{
		// Hack: solve array issue
		if(user && user.get("settings").length === 0) return null;
		
		
		
		//$.extend(Cloudwalkers.Session.settings, user.get("settings"));
	},*/
	
	'updateSetting' : function(attribute, value, callbacks)
	{
	
		if( Cloudwalkers.Session.user.attributes.settings[attribute] != value)
		{
			// Update session and save on user
			Cloudwalkers.Session.user.attributes.settings[attribute] = value;
			
			Cloudwalkers.Session.user.save({settings: Cloudwalkers.Session.user.attributes.settings}, callbacks);
		}
	},
	
	'get' : function(attribute)
	{
		// Update session
		return Cloudwalkers.Session.user.attributes.settings[attribute];
	},
	
	/**
	 *	Users shortcut functions
	 **/
	
	'getUser' : function (id)
	{
		return (id)? this.user.account.users.get (id):  this.user;
	},
	
	'getUsers' : function ()
	{
		return this.user.account.users;
	},
	
	/**
	 *	Accounts shortcut functions
	 **/

	'getAccount' : function (id)
	{
		return (id)? this.user.accounts.get(id):  this.user.account;
	},
	
	'getAccounts' : function (id)
	{
		this.user.accounts;
	},
	
	/**
	 *	Channels shortcut functions
	 **/
	
	'getChannel' : function (id)
	{
		return this.user.account.channels.get (id);
	},
	
	'getChannels' : function (id)
	{
		return this.user.account.channels;
	},
	
	'setChannels' : function (list)
	{
		if(list.length) this.user.account.channels.add(list, {merge: true});
		
		return this;
	},
	
	/**
	 *	Streams shortcut functions
	 **/
	
	'getStream' : function (id)
	{
		return this.user.account.streams.get (id);
	},
	
	'getStreams' : function ()
	{
		return this.user.account.streams;
	},
	
	'setStreams' : function (list)
	{
		if(list.length) this.user.account.streams.add(list, {merge: true});
		
		return this;
	}
}

// Add events
_.extend(Cloudwalkers.Session, Backbone.Events);