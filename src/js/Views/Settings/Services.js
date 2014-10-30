define(
	['Views/BaseView', 'mustache', 'Collections/Services', 'Models/Service', 'Views/Settings/Service'],
	function (BaseView, Mustache, Services, Service, ServiceView)
	{
		var ServicesView = BaseView.extend({

			events : {				
				'click [data-add-service]' : 'addService',
				'click [data-service]' : 'servicedetail',
			},
			
			initialize : function(options)
			{	
				// Create Services collection
				this.services = new Services();
				
				// A service has been added
				if(options.serviceid)
					return this.appendservice(options.serviceid)

				// Get Services options 
				this.listenTo(this.services, "available:ready", this.appendOptions);
				this.services.fetchAvailable();
				
				// Get active services
				this.listenTo(this.services, "add", this.appendService);
				this.listenToOnce(this.services, "add", this.endload);
				this.listenTo(this.services, "ready", this.limited);
				this.services.fetch();

				this.loadListeners(this.services, ['available:ready', 'sync', 'ready'], true);

			},

			render : function ()
			{
				var account = Cloudwalkers.Session.getAccount();
				var data = {};
				
				this.$el.html (Mustache.render (Templates.services, data));
				
				/*// Get Service options MIGRATION
				Cloudwalkers.Net.get ('wizard/service/available', {'account': account.id}, this.appendOptions.bind(this));
				
				// Get connected Services
				Cloudwalkers.Net.get ('wizard/service/list', {'account': account.id}, this.appendConnected.bind(this));
				*/
				this.$container = this.$el.find('.panel-body');
				return this;
			},

			/*
			 *	Add a service to the services list
			 */
			appendservice : function(serviceid)
			{
				var service = new Service({id: serviceid});
				service.addservice();
			},
			
			/*
			 *	Append available services to the side menu
			 */
			appendOptions : function(services, available) {
				
				var $container = this.$el.find(".networks-list");
				
				for (var n in available)
					$container.append(Mustache.render (Templates.service_option, available[n]));

			},
			
			appendService : function(service) {
				
				// Add service attributes to list
				this.$el.find("ul.services").append(Mustache.render (Templates.service_connected, service.attributes));
			},
			
			addService : function (e)
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
					window.location = this.processLink (auth, service.id);
					
				});
				
				this.services.create({},{wait: true, endpoint: token, error: this.error.bind(this)});

			},

			error : function(model, response)
			{	
				var account = Cloudwalkers.Session.getAccount();

				if(!account.monitorlimit('services', this.services.models.length, null, true))
				{
					var error = response.responseJSON? response.responseJSON.error.message: trans("Something went wrong");
					Cloudwalkers.RootView.alert(error);
				}		
			},
			
			limited : function (collection) 
			{
				// Makes the UI disabled on limit
				Cloudwalkers.Session.getAccount().monitorlimit('services', collection.models.length, $(".networks-list"));	
			},
			
			/*'appendOptions' : function(available) {
				
				var $container = this.$el.find("#service-options .portlet-body").removeClass("inner-loading");
				
				for (var n in available.services)
				{
					$container.append(Mustache.render (Templates.settings.service_option, available.services[n]));
				}
			},
			
			'appendConnected' : function(connected) {
				
				var widget = this.$el.find("#service-connected .inner-loading").removeClass("inner-loading");
				var count = 0;
				
				for (var n in connected.services)
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

			servicedetail : function (e)
			{
				var serviceid = $(e.currentTarget).data("service");
				var service = this.services.get(serviceid);

				// Navigate view
				this.$el.find("#service-connected").addClass("open-detail");

				// Create service detailed view
				this.detail = new ServiceView ({model: service, parent: this});
				this.$el.find(".service-detail").html( this.detail.render().el);

				// To check if we can remove the exceeded limit warning
		        this.listenTo(this.detail, 'service:deleted', this.deletedservice.bind(this));
		    },

		    deletedservice : function()
		    {    
		        this.limited(this.services);

			},
			
			closedetail : function ()
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
					var view = new SettingsView.Service ({ 'serviceid' : id });
					container.show ();
					container.html (view.render ().el);

					// Rerender on 
					view.on ('service:delete', function ()
					{
						self.render ();
					});
				}
			},*/

			processLink : function (url, serviceid)
			{
				if (url.indexOf ('?') > 0)
				{
					url = url + '&return=' + encodeURIComponent(window.location.origin + "/#settings/services/"+serviceid);
				}
				else
				{
					url = url + '?return=' + encodeURIComponent(window.location.origin + "/#settings/services/"+serviceid);
				}
				
				return url;
			},
			
			

			addServiceCall : function (e)
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
			
			negotiateFunctionalities : function(el) {

			}
		});

		return ServicesView;
});