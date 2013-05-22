Cloudwalkers.Session = 
{
	'user' : null,
	'account' : null,

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
		this.trigger ('account:change');
	},

	'getAccount' : function ()
	{
		return this.account;
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
				finalcallback ();
			}
			else
			{
				alert ('Your user is not linked to any account. Please contact an administrator.');
			}
		});
	}
}

// Add events
_.extend(Cloudwalkers.Session, Backbone.Events);