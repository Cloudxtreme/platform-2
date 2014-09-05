Cloudwalkers.Views.Settings = Cloudwalkers.Views.Pageview.extend({

	'title' : "Settings",
	'tabs' : [],
	
	'initialize' : function ()
	{
		this.endpoint = this.options.endpoint;
		this.level = Cloudwalkers.Session.user.level;
	},
	
	'setAction' : function (action)
	{
		this.action = action;
	},
	
	'render' : function ()
	{

		var data = {};
		this.tabs = []

		//Mustache Translate Render
		this.mustacheTranslateRender(data);

		// Build tabs
		//if(this.level)
		
		if (Cloudwalkers.Session.isAuthorized('USER_INVITE'))			
			this.tabs.push({url: '#settings/users', name: data.translate_manage_users});

		if (Cloudwalkers.Session.isAuthorized('SERVICE_CONNECT'))
			this.tabs.push({url: '#settings/services', name: data.translate_social_connections});
		
		if (Cloudwalkers.Session.isAuthorized('CAMPAIGN_DELETE'))
			this.tabs.push({url: '#settings/account', name: data.translate_account_settings});
		
		this.tabs.push ({url: '#settings/profile', name: data.translate_profile_settings});
		
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
				var widget = new Cloudwalkers.Views.Settings.Users();
				break;
				
			case 'services':
				var widget = new Cloudwalkers.Views.Settings.Services({serviceid: this.options.serviceid});
				break;
			
			case 'account':
				var widget = new Cloudwalkers.Views.Settings.Account();
				break;
			
			default:
				var widget = new Cloudwalkers.Views.Settings.Profile();
		}
		
		// Append widget
		this.appendWidget(widget, 12);

		return this;
	},
	'translateTitle' : function(translatedata)
	{	
		// Translate Title
		this.title = Cloudwalkers.Session.polyglot.t(translatedata);
	},

	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	},

	'mustacheTranslateRender' : function(translatelocation)
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

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}
	}
	
});