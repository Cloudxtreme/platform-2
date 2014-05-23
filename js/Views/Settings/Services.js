Cloudwalkers.Views.Settings.Services = Backbone.View.extend({

	'events' : {
		/*'click [data-open-service]' : 'openService',
		'click [data-add-service]' : 'addServiceCall',*/
		
		'click [data-add-service]' : 'addService',
		'click [data-service]' : 'servicedetail',
	},
	
	'initialize' : function()
	{
		// Create Services collection
		this.services = new Cloudwalkers.Collections.Services();
		
		// Get Services options 
		this.listenTo(this.services, "available:ready", this.appendOptions);
		this.services.fetchAvailable();
		
		// Get active services
		this.listenTo(this.services, "add", this.appendService);
		this.listenToOnce(this.services, "add", this.endload);
		this.listenTo(this.services, "ready", this.limited);
		this.services.fetch();

		this.loadListeners(this.services, ['request', 'sync', 'ready']);

	},
	
	'endload' : function ()
	{
		//Remove?
		this.$el.find(".inner-loading").removeClass("inner-loading");	
	},

	'render' : function ()
	{
		var account = Cloudwalkers.Session.getAccount();
		var data = {};
		
		
		this.$el.html (Mustache.render (Templates.settings.services, data));
		
		/*// Get Service options
		Cloudwalkers.Net.get ('wizard/service/available', {'account': account.id}, this.appendOptions.bind(this));
		
		// Get connected Services
		Cloudwalkers.Net.get ('wizard/service/list', {'account': account.id}, this.appendConnected.bind(this));
		*/
		this.$container = this.$el.find('.portlet-body');
		return this;
	},
	
	'appendOptions' : function(services, available) {
		
		var $container = this.$el.find(".networks-list");
		
		for (n in available)
		{
			$container.append(Mustache.render (Templates.settings.service_option, available[n]));
		}
	},
	
	'appendService' : function(service) {
		
		// Add service attributes to list
		this.$el.find("ul.services").append(Mustache.render (Templates.settings.service_connected, service.attributes));
	},
	
	'addService' : function (e)
	{
		// Limit
		if(this.$el.find(".networks-list.limited").size()) return null;
		
		
		// Service token
		var token = $(e.target).data ('add-service');
		
		this.listenToOnce(this.services, "sync", function(service)
		{
			var auth = service.get("authenticateUrl");
			
			// Prevent API bug
			if(!auth) return null;
			
			// Go to authentication page
			window.location = this.processLink (auth);
			
		});
		
		this.services.create({},{wait: true, endpoint: token});

	},
	
	'limited' : function (collection) 
	{
		
		Cloudwalkers.Session.getAccount().monitorlimit('services', collection.models.length, $(".networks-list"));	
	},
	
	/*'appendOptions' : function(available) {
		
		var $container = this.$el.find("#service-options .portlet-body").removeClass("inner-loading");
		
		for (n in available.services)
		{
			$container.append(Mustache.render (Templates.settings.service_option, available.services[n]));
		}
	},
	
	'appendConnected' : function(connected) {
		
		var widget = this.$el.find("#service-connected .inner-loading").removeClass("inner-loading");
		var count = 0;
		
		for (n in connected.services)
		{
			widget.find(".social-container").append(Mustache.render (Templates.settings.service_connected, connected.services[n]));
			count++
		}
		
		Cloudwalkers.Session.getAccount().monitorlimit('networks', count, $(".service-options"));	
	},*/
	
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

	'servicedetail' : function (e)
	{
		// Navigate view
		this.$el.find("#service-connected").addClass("open-detail");
		
		// Create service view
		this.detail = new Cloudwalkers.Views.Settings.Service ({id: $(e.currentTarget).data("service"), parent: this});
		this.$el.find(".service-detail").html( this.detail.render().el);
	},
	
	'closedetail' : function ()
	{
		// Navigate view
		this.$el.find("#service-connected").removeClass("open-detail");
		
		this.detail.remove();
	},
	
	/*'openService' : function (e)
	{
		e.preventDefault ();

		var id = $(e.target).attr ('data-open-service');

		var self = this;
		var container = self.$el.find ('[data-service-container=' + id + ']');

		if (container.is(':visible'))
		{
			container.hide ();
		}
		else
		{
			var view = new Cloudwalkers.Views.Settings.Service ({ 'serviceid' : id });
			container.show ();
			container.html (view.render ().el);

			// Rerender on 
			view.on ('service:delete', function ()
			{
				self.render ();
			});
		}
	},*/

	'processLink' : function (url)
	{
		if (url.indexOf ('?') > 0)
		{
			url = url + '&return=' + encodeURIComponent(window.location.origin + "/#settings/services");
		}
		else
		{
			url = url + '?return=' + encodeURIComponent(window.location.origin + "/#settings/services");
		}
		
		return url;
	},
	
	

	'addServiceCall' : function (e)
	{
		e.preventDefault ();

		var self = this;
		var id = $(e.target).attr ('data-add-service');

		this.addService (id, function (data)
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
		});
	},
	
	'negotiateFunctionalities' : function(el) {}
});