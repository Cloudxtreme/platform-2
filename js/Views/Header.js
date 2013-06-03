Cloudwalkers.Views.Header = Backbone.View.extend({

	'events' : {
		'click .notification-toggle' : 'toggleNotifications'
	},

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
		var self = this;

		if (Cloudwalkers.Session.isLoaded ())
		{
			data.user = Cloudwalkers.Session.user;
			data.account = Cloudwalkers.Session.getAccount ();

			data.channels = data.account.channels ();
		}

		$(this.el).html (Mustache.render (Templates.header, data));

		// Load the notifications
		if (Cloudwalkers.Session.getAccount ())
		{
			Cloudwalkers.Session.call 
			(
				'account/' + Cloudwalkers.Session.getAccount ().get ('id') + '/notifications',
				false,
				false,
				function (data)
				{
					self.setNotifications (data.notifications);
				}
			);
		}

		return this;
	},

	'setNotifications' : function (notifications)
	{
		//console.log ('NOTIFICATIONS');
		this.$el.find ('.popup-frame ul').html ('');

		for (var i = 0; i < notifications.length; i ++)
		{
			this.addNotification (notifications[i]);
		}
	},

	'addNotification' : function (notification)
	{
		this.$el.find ('.popup-frame ul').append ('<li><div class="text account"><p>' + notification.message + '</p><div class="row"><span class="time"></span></div></div></li>');
	},

	'toggleNotifications' : function( )
	{
		this.$el.find ('.notification-popup').toggle ();
	}

});