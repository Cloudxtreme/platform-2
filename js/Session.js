Cloudwalkers.Session = 
{
	'user' : null,
	'account' : null,
	'streams' : null,

	'call' : function (method, get, post, callback)
	{
		var url = CONFIG_BASE_URL + 'json/' + method;

		if (typeof (get) != 'undefined' && get)
		{
			url += '?' + jQuery.param (get);
		}

		jQuery.ajax 
		(
			url, 
			{
				'type' : 'post',
				'data' : typeof (post) != 'undefined' && post ? post : {},
				'cache': false,
				'success' : function (data)
				{
					callback (data);
				}
			}
		);
	},

	'isLoaded' : function ()
	{
		return this.user != null;
	},

	'setAccount' : function (account)
	{
		this.account = account;
	},

	'getAccount' : function ()
	{
		return this.account;
	},

	'getChannelFromId' : function (id)
	{
		var channels = this.getAccount ().channels ();

		for (var i = 0; i < channels.length; i ++)
		{
			if (channels[i].id == id)
			{
				return channels[i];
			}
		}
		return null;
	},

	'loadEssentialData' : function (callback)
	{
		var self = this;
		var finalcallback = callback;

		// Loading
		var view = new Cloudwalkers.Views.Loading ();
		Cloudwalkers.RootView.setView (view, false);

		this.call ('user/me', null, null, function (data)
		{
			self.user = new Cloudwalkers.Models.User (data);

			// Set account
			if (self.user.getAccounts ().length > 0)
			{
				self.setAccount (self.user.getAccounts ()[0]);
				self.user.set ('account', self.user.getAccounts ()[0].get ('id'));

				self.loadStreams (function ()
				{
					self.trigger ('account:change', self.account);
					finalcallback ();
				});
			}
			else
			{
				alert ('Your user is not linked to any account. Please contact an administrator.');
			}
		});
	},

	'loadStreams' : function (callback)
	{
		var finalcallback = callback;
		var self = this;

		this.call ('account/' + this.getAccount ().id + '/streams', {}, {}, function (data)
		{
			self.streams = data.streams;
			Cloudwalkers.Utilities.StreamLibrary.parse (self.streams);
			
			setTimeout (function ()
			{
				finalcallback ();	
			}, 1);
			
		});
	},

	'getStreams' : function ()
	{
		return this.streams;
	},

	'getStream' : function (id)
	{
		for (var i = 0; i < this.streams.length; i ++)
		{
			if (this.streams[i].id == id)
			{
				return this.streams[i];
			}
		}
		return null;
	},

	'getUser' : function ()
	{
		return this.user;
	}
}

// Add events
_.extend(Cloudwalkers.Session, Backbone.Events);