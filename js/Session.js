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

	'getAccount' : function (id)
	{
		return (id)? this.user.accounts.get(id):  this.user.account;
	},

	'getChannelFromId' : function (id)
	{
		return this.getAccount ().channels.get (id);
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
	},

	'getStreams' : function ()
	{
		return Cloudwalkers.Session.getAccount().streams;
	},

	'getStream' : function (id)
	{
		return Cloudwalkers.Session.getAccount().streams.get (id);
	},

	'getUser' : function ()
	{
		return this.user;
	}
}

// Add events
_.extend(Cloudwalkers.Session, Backbone.Events);