Cloudwalkers.Views.Navigation = Backbone.View.extend({

	'events' : {
		'click .notification-toggle' : 'toggleNotifications'
	},

	'initialize' : function ()
	{
		// Interact with Session triggers
		Cloudwalkers.Session.on ('change:accounts', this.renderHeader, this);
		Cloudwalkers.Session.on ('account:change change:accounts change:channels change:streams', this.render, this);
	},
	
	'fit' : function ()
	{
		$('#header').html (this.renderHeader().header);
		$('#sidebar').html (this.render().el);
		this.render();
	},
	
	'renderHeader' : function ()
	{		
		var data = {};
		
		data.user = Cloudwalkers.Session.user.attributes;
		data.accounts =  [];
		
		Cloudwalkers.Session.user.accounts.each(function(model)
		{
			data.accounts.push({name: model.get('name'), id: model.id, active: (model.id == Cloudwalkers.Session.get("currentAccount"))})
		});
		
		this.header = Mustache.render (Templates.header, data);

		return this;
	},

	'render' : function ()
	{

		var account = Cloudwalkers.Session.getAccount ();
		var data = { sorted: {}, reports: [], scheduled: []};
		
		data.level = Number(account.get('currentuser').level);

		var channels = Cloudwalkers.Session.getChannels ();
		var sorted = {};
		

		account.channels.each(function(channel)
		{
			data.sorted[channel.get('type')] = {channelid: channel.id, name: channel.get('name'), streams: channel.get('streams'), channels: channel.get('channels')};
		});
		
		$.each(account.streams.where({ 'statistics': 1 }), function(i, stream)
		{
			data.reports.push(stream.attributes);
		});
		
		$.each(account.streams.where({ 'outgoing': 1 }), function(i, stream)
		{
			data.scheduled.push(stream.attributes);
		});

		this.$el.html (Mustache.render(Templates.navigation, data));
		
		this.handleSidebarMenu();
		
		return this;
	},
	
	'handleSidebarMenu' : function () {
		
		var path = Backbone.history.fragment;
		
		// Ignore Dashboard start
		if(!path) return null;
		
		// Toggle .active class
		$('#sidebar .active').removeClass ('active');
		$('a[href="#' + path + '"]').parents('#sidebar .page-sidebar-menu *').addClass ('active');
		
		// Trace height
		var height =  $(($(window).height() > $(document).height())? window: document).height();
		$("#inner-content").css("min-height", height-42 + "px");
		
    },

	'setNotifications' : function (notifications)
	{
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
	
	// Add unread count logic for inbox icon
	/*
		// New messages
		Cloudwalkers.Session.getUser ().on ('change:unread', function (newnumber)
		{
			setUnreadCount (newnumber);
		});
		
		---------
		
		function setUnreadCount (newnumber)
		{
			if (newnumber > 0)
			{
				$('.unread-messages-count').html (newnumber).show ();
			}
			else
			{
				$('.unread-messages-count').html (0).hide ();	
			}
		}
		
		----------
		
		// Load the notifications
		if (Cloudwalkers.Session.getAccount ())
		{
			Cloudwalkers.Net.get
			(
				'account/' + Cloudwalkers.Session.getAccount ().id + '/notifications',
				false,
				function (data)
				{
					self.setNotifications (data.notifications);
				}
			);
		}
		
	*/

});