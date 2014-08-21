Cloudwalkers.Views.Navigation = Backbone.View.extend({

	'views' : [
		{name: 'dashboard', title: "Dashboard", icon: "dashboard", authorized: 0},
		{name: 'inbox', title: "Inbox", icon: "inbox", authorized: 0, children: [
			{name: 'messages', title: "Messages", icon: "envelope", authorized: 0},
			{name: 'notifications', title: "Notifications", icon: "globe", authorized: 0},
			{name: 'post', title: "Post message", icon: "pencil", url: false, authorized: 0, attributes: {'data-header-action': "post"}},
			{name: 'drafts', title: "Drafts", icon: "edit", url: "#drafts", authorized: 0},
			{name: 'scheduled', title: "Scheduled", icon: "time", url: "#drafts", authorized: 0}
		]},
		{name: 'coworkers', title: "Co-workers wall", icon: "group", authorized: 0},
		{name: 'profiles', title: "Company accounts", build: "profiles", icon: "briefcase", authorized: 0, childicons:["briefcase", "thumbs-up"]},
		{name: 'news', title: "Profiles We Follow", build: "news", icon: "globe", authorized: 0, childicons:["globe", "thumbs-up"]},
		{name: 'monitoring', title: "Keyword Monitoring", build: "monitoring", icon: "tags", authorized: 0, childicons:["tags", "plus"]},
		{name: 'statistics', title: "Statistics", build: "reports", icon: "bar-chart", authorized: 0},
		{name: 'settings', title: "Settings", icon: "cogs", url: "#settings/users", authorized: 0, children: [
			{name: 'users', title: "Manage users", icon: "group", authorized: 0},
			{name: 'networks', title: "Social Connections", icon: "cloud", authorized: 0},
			{name: 'post', title: "Post message", icon: "pencil", url: false, authorized: 0, attributes: {'data-header-action': "post"}},
			{name: 'settings', title: "Account Settings", icon: "briefcase", url: "#settings/account", authorized: 0},
			{name: 'profile', title: "Profile settings", icon: "user", authorized: 0}
		]}
	],
	
	'events' : {
		'click .notification-toggle' : 'toggleNotifications',
		'click .btn-compose' : 'compose',
		'click #writenote' : 'writenote',
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
		$.get(CONFIG_BASE_URL + "json/version", this.version.bind(this));
		
	},
	
	'headeraction' : function(element)
	{
		// Action token
		var token = $(element.currentTarget).data ('header-action');
		
		if(token == 'messages') Cloudwalkers.Router.Instance.navigate("#inbox/messages", true);
		if(token == 'contacts') Cloudwalkers.Router.Instance.navigate("#coworkers", true);
		if(token == 'post') Cloudwalkers.RootView.compose();
		if(token == 'writenote') this.writenote();
		//if(token == 'post') Cloudwalkers.RootView.popup (new Cloudwalkers.Views.Write ());
		//this.model.trigger("action", token);
	},
	
	'fit' : function ()
	{
		$('#header').html (this.renderHeader().header);
		$('#sidebar').html (this.render().el);
		//this.render();

		$("#header, #sidebar").on("click", '*[data-header-action]', this.headeraction.bind(this));
	},
	
	'version' : function (response)
	{
		// Add DEV views
		if( response.platform.name == "TESTING" || response.platform.name == "DEVELOPMENT")
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
		data.level = Cloudwalkers.Session.getUser().level;

		// Manage User Groups Roles
		if ((Cloudwalkers.Session.isAuthorized('USER_GRANT')) | (Cloudwalkers.Session.isAuthorized('GROUP_MANAGE')))
			data.manage_user_groups = true;

		//Mustache Translate Header
		this.mustacheTranslateRenderHeader(data);
		
		Cloudwalkers.Session.user.accounts.each(function(model)
		{
			data.accounts.push({name: model.get('name'), id: model.id, active: (model.id == Cloudwalkers.Session.get("currentAccount"))})
		});
		
		// Apply role permissions to template data
		Cloudwalkers.Session.censuretemplate(data);
		
		this.header = Mustache.render (Templates.header, data);

		return this;
	},

	'render' : function ()
	{

		var account = Cloudwalkers.Session.getAccount ();
		var data = {reports: []};
		
		data.level = Cloudwalkers.Session.getUser().level;
		
		//Mustache Translate Render
		this.mustacheTranslateRender(data);

		// Administrator
		//if(data.level)
		//{
			
		// News
		if (Cloudwalkers.Session.isAuthorized('MESSAGE_READ_THIRDPARTY')){
			data.news = account.channels.findWhere({type: "news"});
			if(data.news) data.news = account.channels.findWhere({type: "news"}).id;
		}
			
		// Monitoring
		if (Cloudwalkers.Session.isAuthorized('MESSAGE_READ_MONITORING')){
			
			var monitoring = account.channels.findWhere({type: "monitoring"});

			for(n in monitoring.channels.models){
				if(monitoring.channels.models[n].attributes.channels.length){
					this.first =  monitoring.channels.models[n]
					break;
				}			
			}

			if(monitoring)	data.monitoring = {channelid: monitoring.id, first: this.first, channels: monitoring.channels.models, name: monitoring.get("name")};
		}			
		//}
		
		// Scheduled
		if (Cloudwalkers.Session.isAuthorized('MESSAGE_READ_SCHEDULE')){
			data.scheduled = {channelid: Cloudwalkers.Session.getChannel("internal").id};
			data.scheduled.streams = account.streams.where({outgoing: 1});
		}
		
		// Inbox
		if (Cloudwalkers.Session.isAuthorized('_CW_INBOX_VIEW')){
			data.inbox = true;
		}
		
		// Profiles
		if (Cloudwalkers.Session.isAuthorized('MESSAGE_READ_COMPANY')){
			var profiles = account.channels.findWhere({type: "profiles"});
			data.profiles = {channelid: profiles.id, streams: profiles.streams.models, name: profiles.get("name")};
		}
			
		// Reports
		if (Cloudwalkers.Session.isAuthorized('STATISTICS_VIEW')){
			data.reports = account.streams.where({ 'statistics': 1 }).map(function(stream)
			{
				return stream.attributes;
			});
		}
		
		// Apply role permissions to template data
		Cloudwalkers.Session.censuretemplate(data);
		
		this.$el.html (Mustache.render(Templates.navigation, data));
		
		this.handleSidebarMenu();
		
		return this;
	},
	
	'handleSidebarMenu' : function () {
		
		var path = Backbone.history.fragment;
		
		// Ignore Dashboard start
		if(!path) return null;
		
		this.setActive(path);
    },
    
    'compose' : function () { Cloudwalkers.RootView.compose(); },

    'writenote' : function ()
    {
    	var account = Cloudwalkers.Session.getAccount();
		Cloudwalkers.RootView.writeNote(account); 
	},
    
    'setActive' : function (path) {
		
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
	},
	
	'mapViews' : function ()
	{
		var views = {};
		
		for(n in this.views)
		{

			views[this.views[n].name] = {streams: []};
			
			// children on same level
			if(this.views[n].children) 
				for(i in this.views[n].children) views[this.views[n].children[i].name] = {streams: []};
		}
		
		return views;
	},

	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	},
	'mustacheTranslateRenderHeader' : function(translatelocation)
	{
		// Translate array
		this.original  = [
			"write_note",
			"clean",
			"support",
			"profile_settings",
			"log_out"
		];

		this.translated = [];

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}
	},
	'mustacheTranslateRender' : function(translatelocation)
	{
		// Translate array
		this.original  = [
			"compose",
			"dashboard",
			"message_board",
			"compose_message",
			"drafts",
			"scheduled",
			"inbox",
			"messages",
			"notifications",
			"post_message",
			"calendar",
			"co-workers_wall",
			"company_accounts",
			"media",
			"trending_posts",
			"accounts_we_follow",
			"keyword_monitoring",
			"manage_accounts",
			"manage_keywords",
			"reports",
			"settings",
			"manage_users",
			"social_connections",
			"account_settings",
			"profile_settings",
			"manage_user_groups",
			"notes",
			"rss_feed",
			"manage_rss",
			"sent",
			"outbox",
			"calendar"

		];

		this.translated = [];

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}
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