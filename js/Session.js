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
		
		console.log("Session.refresh triggered")
		
		/*this.getAccount ().refresh (function ()
		{
			Cloudwalkers.Session.trigger ('channels:change');
		});*/
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
		return (typeof id == "number")? this.user.account.channels.get(id): this.user.account.channels.findWhere({type: id});
	},
	
	'getChannels' : function (id)
	{
		return this.user.account.channels;
	},
	
	/*'setChannels' : function (list)
	{
		if(list && list.length) this.user.account.channels.add(list, {merge: true});
		
		return this;
	},*/
	
	'storeChannel' : function(channel)
	{
		// Store child channels
		if( channel.channels && channel.channels.length)
			channel.channels = channel.channels.map(function(el)
			{ 
				Cloudwalkers.Session.storeChannel(el);
				return el.id;
			});
		
		// Store child streams
		if( channel.streams && channel.streams.length)
			channel.streams = channel.streams.map(function(el)
			{ 
				Store.post("streams", el);
				return el.id;
			});
		
		
		//console.log("channel:", channel, "children:", channel.channels)
			
		Store.post("channels", channel);
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
	
	/*'setStreams' : function (list)
	{
		if(list && list.length) this.user.account.streams.add(list, {merge: true});
		
		return this;
	},*/
	
	/**
	 *	Messages shortcut functions
	 **/
	
	'getMessage' : function (id)
	{
		return this.user.account.messages.get (id);
	},
	
	'getMessages' : function ()
	{
		return this.user.account.messages;
	}
}

// Add events
_.extend(Cloudwalkers.Session, Backbone.Events);