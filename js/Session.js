Cloudwalkers.Session = 
{
	'user' : null,
	'account' : null,
	'streams' : null,
	'settings' : {
		'currentAccount' : null,
		'viewMode' : null
	},

	'isLoaded' : function ()
	{
		return this.user != null;
	},
	
	'getUser' : function ()
	{
		return this.user;
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

	'loadEssentialData' : function (callback)
	{
		this.user = new Cloudwalkers.Models.Me();

		this.user.once("change", callback);
		this.user.fetch();
	},

	'poll' : function ()
	{
		var self = this;
		this.call ('user/me', null, null, function (data)
		{
			self.user.set (data.user);
		});
	}
}

// Add events
_.extend(Cloudwalkers.Session, Backbone.Events);