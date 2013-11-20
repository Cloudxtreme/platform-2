Cloudwalkers.Session = 
{
	'user' : null,
	'account' : null,
	'streams' : null,

	/*'call' : function (method, get, post, callback)
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
	},*/

	'isLoaded' : function ()
	{
		return this.user != null;
	},

	'setAccount' : function (account, callback)
	{
		var self = this;

		if (typeof (callback) == 'undefined')
		{
			callback = function () {};
		}

		this.user.set ('account', account.get ('id'));
		this.account = account;

		this.loadStreams (function ()
		{
			self.trigger ('account:change', self.account);
			callback ();
		})
	},

	'getAccount' : function ()
	{
		return this.account;
	},

	'getChannelFromId' : function (id)
	{
		return this.getAccount ().channel (id);
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
		var self = this;
		var finalcallback = callback;

		Cloudwalkers.Net.get('user/me', null, function(data)
		{
			self.user = new Cloudwalkers.Models.User (data.user);
			
			// Set account
			if (self.user.getAccounts ().length > 0)
			{
				self.setAccount 
				(
					self.user.getAccounts ()[0],
					finalcallback
					
				)
			}
			else
			{
				alert ('Your user is not linked to any account. Please contact an administrator.');
			}
			
		});

		//console.log(Backbone.sync)

		/*this.call ('user/me', null, null, function (data)
		{
			self.user = new Cloudwalkers.Models.User (data.user);

			// Set account
			if (self.user.getAccounts ().length > 0)
			{
				self.setAccount 
				(
					self.user.getAccounts ()[0],
					function ()
					{
						finalcallback ();
					}
				)
			}
			else
			{
				alert ('Your user is not linked to any account. Please contact an administrator.');
			}

			// Start refreshing
			setInterval (function ()
			{
				self.poll ();
			}, 1000 * 60)
		});*/
	},

	'poll' : function ()
	{
		var self = this;
		this.call ('user/me', null, null, function (data)
		{
			self.user.set (data.user);
		});
	},

	'loadStreams' : function (callback)
	{
		Cloudwalkers.Utilities.StreamLibrary.reset ();

		var finalcallback = callback;
		var self = this;
		
		Cloudwalkers.Net.get('account/' + this.getAccount ().id + '/streams', null, function (data)
		{
			self.streams = data.streams;
			Cloudwalkers.Utilities.StreamLibrary.parse (self.streams);
			
			setTimeout (function ()
			{
				finalcallback ();	
			}, 1);
		});

		/*this.call (, {}, {}, function (data)
		{
			self.streams = data.streams;
			Cloudwalkers.Utilities.StreamLibrary.parse (self.streams);
			
			setTimeout (function ()
			{
				finalcallback ();	
			}, 1);
			
		});*/
	},

	'getStreams' : function ()
	{
		return Cloudwalkers.Utilities.StreamLibrary.getStreams ();
	},

	'getStream' : function (id)
	{
		return Cloudwalkers.Utilities.StreamLibrary.getFromId (id);
	},

	'getUser' : function ()
	{
		return this.user;
	}
}

// Add events
_.extend(Cloudwalkers.Session, Backbone.Events);