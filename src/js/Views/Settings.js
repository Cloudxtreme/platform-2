define(
	['Views/Pageview', 'mustache',  'Views/Settings/Services', 'Views/Settings/Users', 'Views/Settings/Account', 'Views/Settings/Profile'],
	function (Pageview, Mustache, ServicesView, UsersSettingsView, AccountSettings, ProfileSettings)
	{
		var Settings = Pageview.extend({

			title : "Settings",
			tabs : [],
			
			'initialize' : function (options)
			{	
				$.extend(this, options);
			},
			
			setAction : function (action)
			{
				this.action = action;
			},
			
			render : function ()
			{
				//$("#inner-content").css("background","#F0F3F4");
				var data = {};
				var widget;

				this.tabs = []

				//Mustache Translate Render
				this.mustacheTranslateRender(data);

				// Build tabs				
				if (Cloudwalkers.Session.isAuthorized('USER_INVITE'))			
					this.tabs.push({url: '#settings/users', name: data.translate_manage_users});

				if (Cloudwalkers.Session.isAuthorized('SERVICE_CONNECT'))
					this.tabs.push({url: '#settings/services', name: data.translate_social_connections});
				
				if (Cloudwalkers.Session.isAuthorized('CAMPAIGN_DELETE'))
					this.tabs.push({url: '#settings/account', name: data.translate_account_settings});
				
				this.tabs.push ({url: '#settings/profile', name: data.translate_profile_settings});

				// Manage User Groups Roles
				/*if ((Cloudwalkers.Session.isAuthorized('GROUP_MANAGE')) || (Cloudwalkers.Session.isAuthorized('USER_GRANT')))
					this.tabs.push ({url: '#settings/manageusergroups', name: data.translate_manage_user_groups});*/
				
				// Translation for Title
				this.translateTitle("settings");
				
				// Build Pageview
				this.$el.html (Mustache.render (Templates.tabview, {title : this.title, tabs: this.tabs}));
				this.$container = this.$el.find("#widgetcontainer").eq(0);
				
				// Set correct tab
				this.$el.find('.nav-tabs a[href="#settings/' + this.endpoint + '"]').parent().addClass ('active');

				
				switch(this.endpoint)
				{
					case 'users':
						widget = new UsersSettingsView();
						break;
						
					case 'services':
						widget = new ServicesView({serviceid: this.serviceid});
						break;
					
					case 'account':
						widget = new AccountSettings();
						break;

					/*case 'manageusergroups':
						var widget = new SettingsView.ManageUserGroups();
						break;*/
					
					default:
						widget = new ProfileSettings();
				}
				
				// Append widget
				this.appendWidget(widget, 12);

				return this;
			},
			translateTitle : function(translatedata)
			{	
				// Translate Title
				this.title = Cloudwalkers.Session.translate(translatedata);
			},

			translateString : function(translatedata)
			{	
				// Translate String
				return Cloudwalkers.Session.translate(translatedata);
			},

			mustacheTranslateRender : function(translatelocation)
			{
				// Translate array
				this.original  = [
					"manage_users",
					"social_connections",
					"account_settings",
					"manage_user_groups",
					"profile_settings"
				];

				this.translated = [];

				for (var k in this.original)
				{
					this.translated[k] = this.translateString(this.original[k]);
					translatelocation["translate_" + this.original[k]] = this.translated[k];
				}
			}
			
		});
		
		return Settings;
	}
);