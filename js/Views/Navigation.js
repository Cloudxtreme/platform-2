Cloudwalkers.Views.Navigation = Backbone.View.extend({

	'events' : {
		'click .notification-toggle' : 'toggleNotifications'
	},

	'initialize' : function ()
	{
		// Interact with Session triggers
		Cloudwalkers.Session.on ('change:accounts', this.renderHeader, this);
		//Cloudwalkers.Session.on ('account:change change:accounts change:channels change:streams', this.render, this);
		
		// Listen to channel changes
		this.listenTo(Cloudwalkers.Session.getChannels(), 'sync', this.render);
		this.listenTo(Cloudwalkers.Session.getChannels(), 'remove', this.render);
		
		// DEV Check
		$.get(CONFIG_BASE_URL + "json/version", this.version.bind(this))
		
		
	},
	
	'fit' : function ()
	{
		$('#header').html (this.renderHeader().header);
		$('#sidebar').html (this.render().el);
		this.render();
	},
	
	'version' : function (response)
	{
		// Add DEV views
		if( response.platform.name == "TESTING")
		{
			this.development = true;
			$('#header').html (this.renderHeader().header);
		}
		
		// Check for version.
		/*if(!Cloudwalkers.Session.get("version"))
			Cloudwalkers.Session.updateSetting("version", response.platform.version)
				
		else if(Cloudwalkers.Session.get("version") != response.platform.version)
			Cloudwalkers.Session.home();*/
		
	},
	
	'renderHeader' : function ()
	{		
		var data = {dev: this.development};
		
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
		var data = {reports: []};
		
		data.level = Number(account.get('currentuser').level);

		// Scheduled
		data.scheduled = {channelid: Cloudwalkers.Session.getChannel("internal").id};
		data.scheduled.streams = account.streams.where({outgoing: 1});
		
		// Inbox
		var inbox = Cloudwalkers.Session.getChannel("inbox");
		if(inbox) data.inbox = {channelid: inbox.id, streams: inbox.streams.models, name: inbox.get("name")};
		
		// Profiles
		var profiles = account.channels.findWhere({type: "profiles"});
		data.profiles = {channelid: profiles.id, streams: profiles.streams.models, name: profiles.get("name")};

		// News
		var news = account.channels.findWhere({type: "news"});
		data.news = {channelid: news.id, streams: news.streams.models, name: news.get("name")};
		
		// Monitoring
		var monitoring = account.channels.findWhere({type: "monitoring"});
		data.monitoring = {channelid: monitoring.id, channels: monitoring.channels.models, name: monitoring.get("name")};
		
		// Reports
		data.reports = account.streams.where({ 'statistics': 1 }).map(function(stream)
		{
			return stream.attributes;
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