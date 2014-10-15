define(	// MIGRATION -> added mustache
	['backbone', 'mustache'],
	function (Backbone, Mustache)
	{
		var Navigation = Backbone.View.extend({

			views : [
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
				{name: 'statistics', title: "Statistics", build: "statistics", icon: "bar-chart", authorized: 0},
				{name: 'settings', title: "Settings", icon: "cogs", url: "#settings/users", authorized: 0, children: [
					{name: 'users', title: "Manage users", icon: "group", authorized: 0},
					{name: 'networks', title: "Social Connections", icon: "cloud", authorized: 0},
					{name: 'post', title: "Post message", icon: "pencil", url: false, authorized: 0, attributes: {'data-header-action': "post"}},
					{name: 'settings', title: "Account Settings", icon: "briefcase", url: "#settings/account", authorized: 0},
					{name: 'profile', title: "Profile settings", icon: "user", authorized: 0}
				]}
			],
			
			events : {
				'click .notification-toggle' : 'toggleNotifications',
				'click .btn-compose' : 'compose',
				'click #writenote' : 'writenote',
			},

			initialize : function ()
			{
				// Interact with Session triggers
				Cloudwalkers.Session.on ('change:accounts', this.renderHeader, this);	
				
				// Listen to channel changes
				this.listenTo(Cloudwalkers.Session.getChannels(), 'sync', this.render);
				this.listenTo(Cloudwalkers.Session.getChannels(), 'remove', this.render);
				
				// DEV Check
				// $.get(Cloudwalkers.Session.api + '/version', this.version.bind(this)); //{headers: {'Authorization': 'Bearer ' + Cloudwalkers.Session.authenticationtoken, 'Accept': "application/json"}}
			},
			
			headeraction : function(element)
			{
				// Action token
				var token = $(element.currentTarget).data ('header-action');
				
				if(token == 'messages') 	Cloudwalkers.Router.navigate("#inbox/messages", true);
				if(token == 'contacts') 	Cloudwalkers.Router.navigate("#coworkers", true);
				if(token == 'post') 		Cloudwalkers.RootView.compose();
				if(token == 'writenote') 	this.writenote();
			},
			
			fit : function ()
			{
				$('#header').html (this.renderHeader().header);
				$('#sidebar').html (this.render().el);
				//this.render();

				$("#header, #sidebar").on("click", '*[data-header-action]', this.headeraction.bind(this));
			},
			
			version : function (response)
			{
				// Add DEV views
				if( response.platform.name == "TESTING" || response.platform.name == "DEVELOPMENT")
				{
					this.development = true;
					$('#header').html (this.renderHeader().header);
				}
			},
			
			renderHeader : function ()
			{		
				var data = {dev: this.development};
				
				data.user 		= Cloudwalkers.Session.user? Cloudwalkers.Session.user.attributes: null;
				data.accounts 	=  [];
				
				//Manage User Groups Roles
				if ((Cloudwalkers.Session.isAuthorized('USER_GRANT')) || (Cloudwalkers.Session.isAuthorized('GROUP_MANAGE')))
					data.manage_user_groups = true;

				//Render accounts
				if (Cloudwalkers.Session.user)
				{
					Cloudwalkers.Session.user.accounts.each(function(model)
					{
						data.accounts.push({name: model.get('name'), id: model.id, active: (model.id == Cloudwalkers.Session.get("currentAccount"))})
					});
				}
				
				// Apply role permissions to template data
				Cloudwalkers.Session.censuretemplate(data);

				//Mustache Translate Header
				this.mustacheTranslateRenderHeader(data);
				
				this.header = Mustache.render (Templates.header, data);

				return this;
			},

			render : function ()
			{	
				var account = Cloudwalkers.Session.user? Cloudwalkers.Session.user.account: null;
				var data 	= {
					translate: Cloudwalkers.Polyglot.translatetemplate,
					reports: []
				};
				
				// News
				if (Cloudwalkers.Session.isAuthorized('MESSAGE_READ_THIRDPARTY'))
					data.news = this.rendernews(account)
				
				// Monitoring
				if (Cloudwalkers.Session.isAuthorized('MESSAGE_READ_MONITORING'))
					data.monitoring = this.rendermonitoring(account)			
				
				// Scheduled
				if (Cloudwalkers.Session.isAuthorized('MESSAGE_READ_SCHEDULE'))
					data.scheduled = this.renderscheduled(account);
				
				// Inbox
				if (Cloudwalkers.Session.isAuthorized('_CW_INBOX_VIEW'))
					data.inbox = true;

				// Profiles
				if (Cloudwalkers.Session.isAuthorized('MESSAGE_READ_COMPANY'))
					data.profiles = this.renderprofiles(account)
					
				// Reports -> Deprecated, swapped to statistics
				if (Cloudwalkers.Session.isAuthorized('STATISTICS_VIEW'))
					data.statistics = true;

				//Mustache Translate Render
				//this.mustacheTranslateRender(data);
			
				// Apply role permissions to template data
				Cloudwalkers.Session.censuretemplate(data);
				
				this.$el.html (Mustache.render(Templates.navigation, data));
				
				this.handleSidebarMenu();
				
				return this;
			},

			rendernews : function(account)
			{
				var news = account.channels.findWhere({type: "news"});	

				if(news)	return news.id;
			},

			rendermonitoring : function(account)
			{
				var monitoring = account.channels.findWhere({type: "monitoring"});
				
				for (var n in monitoring.channels.models)
				{
					if(monitoring.channels.models[n].attributes.channels.length)
					{
						this.first = monitoring.channels.models[n]
						break;
					}			
				}

				if(monitoring)
					return 	{	channelid: 	monitoring.id, 
								first:    	this.first, 
								channels: 	monitoring.channels.models, 
								name: 		monitoring.get("name") 
							};
			},	

			renderscheduled : function(account)
			{
				var scheduled = { 
					channelid: 	Cloudwalkers.Session.getChannel("internal").id,
					streams: 	account.streams.where({outgoing: 1})
				};

				if(scheduled)
					return scheduled;
			},

			renderprofiles : function(account)
			{
				var profiles 	= account.channels.findWhere({type: "profiles"});
				
				if(profiles)
					return 	{	channelid: 	profiles.id, 
								streams: 	profiles.streams.models,
								name: 		profiles.get("name")
							};
			},
			
			handleSidebarMenu : function () {
				
				var path = Backbone.history.fragment;
				
				// Ignore Dashboard start
				if(!path) return null;
				
				this.setActive(path);
		    },
		    
		    compose : function () { Cloudwalkers.RootView.compose(); },

		    writenote : function ()
		    {
		    	var account = Cloudwalkers.Session.getAccount();
				Cloudwalkers.RootView.writeNote(account); 
			},
		    
		    setActive : function (path) {
				
				// Toggle .active class
				$('#sidebar .active').removeClass ('active');
				$('a[href="#' + path + '"]').parents('#sidebar .page-sidebar-menu *').addClass ('active');
		    },

			setNotifications : function (notifications)
			{
				this.$el.find ('.popup-frame ul').html ('');

				for (var i = 0; i < notifications.length; i ++)
				{
					this.addNotification (notifications[i]);
				}
			},

			addNotification : function (notification)
			{
				this.$el.find ('.popup-frame ul').append ('<li><div class="text account"><p>' + notification.message + '</p><div class="row"><span class="time"></span></div></div></li>');
			},

			toggleNotifications : function( )
			{
				this.$el.find ('.notification-popup').toggle ();
			},
			
			mapViews : function ()
			{
				var views = {};
				
				for (var n in this.views)
				{

					views[this.views[n].name] = {streams: []};
					
					// children on same level
					if(this.views[n].children) 
						for(var i in this.views[n].children) views[this.views[n].children[i].name] = {streams: []};
				}
				
				return views;
			},

			mustacheTranslateRenderHeader : function(translatelocation)
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

				for (var k in this.original)
				{
					this.translated[k] = Cloudwalkers.Polyglot.translate(this.original[k]);
					translatelocation["translate_" + this.original[k]] = this.translated[k];
				}
			},

			mustacheTranslateRender : function(translatelocation)
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
					"statistics",
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

				for (var k in this.original)
				{
					this.translated[k] = Cloudwalkers.Polyglot.translate(this.original[k]);
					translatelocation["translate_" + this.original[k]] = this.translated[k];
				}
			}
		});

		return Navigation;
	});