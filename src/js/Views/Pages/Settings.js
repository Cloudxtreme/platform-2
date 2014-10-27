define(
	['Views/Pages/PageView', 'mustache',  'Views/Settings/Services', 'Views/Settings/Users', 'Views/Settings/Account', 'Views/Settings/Profile'],
	function (Pageview, Mustache, ServicesView, UsersSettingsView, AccountSettings, ProfileSettings)
	{
		var Settings = Pageview.extend({

			title : "Settings",
			id: 'settings',
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
				var widget;

				this.tabs = []

				// Build tabs				
				if (Cloudwalkers.Session.isAuthorized('USER_INVITE'))			
					this.tabs.push({url: '#settings/users', name: "Manage users"});

				if (Cloudwalkers.Session.isAuthorized('SERVICE_CONNECT'))
					this.tabs.push({url: '#settings/services', name: "Social connections"});
				
				if (Cloudwalkers.Session.isAuthorized('CAMPAIGN_DELETE'))
					this.tabs.push({url: '#settings/account', name: "Account settings"});
				
				this.tabs.push ({url: '#settings/profile', name: "Profile settings"});

				// Manage User Groups Roles
				/*if ((Cloudwalkers.Session.isAuthorized('GROUP_MANAGE')) || (Cloudwalkers.Session.isAuthorized('USER_GRANT')))
					this.tabs.push ({url: '#settings/manageusergroups', name: data.translate_manage_user_groups});*/

				// Build Pageview
				this.$el.html (Mustache.render (Templates.tabview, {title : trans(this.title), tabs: this.tabs}));
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
			}
			
		});
		
		return Settings;
	}
);