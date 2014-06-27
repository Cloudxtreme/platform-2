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

		// Translations
		var data = {};
		data.translate_manage_users = this.translateString("manage_users");
		data.translate_social_connections = this.translateString("social_connections");
		data.translate_account_settings = this.translateString("account_settings");


		// Build tabs
		if(this.level)
			
			this.tabs = [
				{url: '#settings/users', name: data.translate_manage_users},
				{url: '#settings/services', name: data.translate_social_connections},
				{url: '#settings/account', name: data.translate_account_settings}
			];
		
		else this.tabs = [];
		
		this.tabs.push ({url: '#settings/profile', name: "Profile settings"});
		
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
				var widget = new Cloudwalkers.Views.Settings.Services();
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
	}
	
});