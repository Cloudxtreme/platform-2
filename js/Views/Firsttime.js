Cloudwalkers.Views.Firsttime = Cloudwalkers.Views.Pageview.extend({

	'title' : "First Time",
	'events' : {
		'remove': 'destroy',
		'click [data-add-service]' : 'addService'
	},
	
	'initialize' : function()
	{
		// Create Services collection
		this.services = new Cloudwalkers.Collections.Services();
		
		// Get Services options 
		this.listenTo(this.services, "available:ready", this.appendOptions)
		this.services.fetchAvailable();

	},
		
	'render' : function ()
	{
		// Navigation view
		Backbone.history.fragment = "settings/services";
		
		// Alter menu view
		$('#sidebar').addClass("collapsed");
		$('#inner-content').addClass("expanded");
		
		// View
		params = {displayname: Cloudwalkers.Session.user.get("displayname")};

		this.$el.html (Mustache.render (Templates.firsttime, params));

		return this;
	},
	
	'appendOptions' : function(services, available) {
		
		var $container = this.$el.find(".networks-list");
		
		for (n in available)
		{
			$container.append(Mustache.render (Templates.settings.service_option, available[n]));
		}
	},

	'processLink' : function (url)
	{
		
		if (url.indexOf ('?') > 0)
		{
			url = url + '&return=' + encodeURIComponent(window.location);
		}
		else
		{
			url = url + '?return=' + encodeURIComponent(window.location);
		}
		return url;
	},

	'addService' : function (e)
	{
		e.preventDefault ();
		
		// Service token
		var token = $(e.target).data ('add-service');
		
		this.listenToOnce(this.services, "sync", function(service)
		{
			$.each (service.get("settings"), function (n, setting)
			{
				if (setting.type == 'link')
					window.location = this.processLink (setting.url);
				
			}.bind(this));
		
			this.render();
		});
		
		this.services.create({},{wait: true, endpoint: token});

	},
	
	'destroy' : function ()
	{
		$('#sidebar, #inner-content').removeClass("collapsed expanded");
	}
});