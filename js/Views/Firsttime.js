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
	
	/*'addService' : function (id, callback)
	{
		
		
		
		Cloudwalkers.Net.post 
		(
			'wizard/service/add',
			{
				'account' : Cloudwalkers.Session.getAccount ().get ('id')
			},
			{
				'id' : id
			},
			callback
		);
	},*/

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
		
		/*this.listenToOnce(this.service, "sync", function()
		{
			
			console.log(a,b,c)
		});
		*/
		
		console.log(this.services.create({},{wait: true, endpoint: token}).attributes);



		/*this.addService (id, function (data)
		{
			if (typeof (data.error) != 'undefined')
			{
				Cloudwalkers.RootView.alert (data.error.message);
			}
			else
			{
				// Most services will provide an authentication URL.
				// If available, redirect user to that URL now.
				$.each (data.service.settings, function (i, v)
				{
					if (v.type == 'link')
					{
						var url = self.processLink (v.url);
						//alert (url);
						window.location = url;
					}
				});

				self.render ();
			}
		});*/
	},
	
	'destroy' : function ()
	{
		$('#sidebar, #inner-content').removeClass("collapsed expanded");
	}
});