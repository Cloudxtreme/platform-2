Cloudwalkers.Views.Firsttime = Cloudwalkers.Views.Pageview.extend({

	'title' : "First Time",
	'events' : {
		'remove': 'destroy'
	},
	
	'initialize' : function()
	{
		var account = Cloudwalkers.Session.getAccount();
		
		// Get Service options
		Cloudwalkers.Net.get ('wizard/service/available', {'account': account.id}, this.appendOptions.bind(this));

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
	
	'appendOptions' : function(available) {
		
		var $container = this.$el.find(".networks-list");
		
		for (n in available.services)
		{
			$container.append(Mustache.render (Templates.settings.service_option, available.services[n]));
		}
	},
	
	'destroy' : function ()
	{
		$('#sidebar, #inner-content').removeClass("collapsed expanded");
	}
});