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

		// Build tabs
		if(this.level)
		{
			this.tabs = [
				{url: '#settings/users', name: "Manage users"},
				{url: '#settings/services', name: "Social connections"},
				{url: '#settings/account', name: "Account settings"}
			];
		}
		
		this.tabs.push ({url: '#settings/profile', name: "Profile settings"});
		
		
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
	}
	
});