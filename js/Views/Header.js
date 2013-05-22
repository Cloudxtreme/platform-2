Cloudwalkers.Views.Header = Backbone.View.extend({

	'initialize' : function ()
	{
		var self = this;

		// On session change, we need to refresh this.
		Cloudwalkers.Session.on ('account:change', function ()
		{
			self.render ();
		});
	},

	'render' : function ()
	{
		var data = {};

		if (Cloudwalkers.Session.isLoaded ())
		{
			data.user = Cloudwalkers.Session.user;
			data.account = Cloudwalkers.Session.getAccount ();

			data.channels = data.account.channels ();
		}

		$(this.el).html (Mustache.render (Templates.header, data));

		return this;
	}

});