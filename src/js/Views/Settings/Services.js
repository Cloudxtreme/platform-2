define(
	['backbone', 'Collections/Services', 'Models/Service', 'Views/Root', 'Views/Settings', 'Router'],
	function (Backbone, Services, Service, RootView, SettingsView, Router)
	{
		var Services = Backbone.View.extend({

			events : {
				/*'click [data-open-service]' : 'openService',
				'click [data-add-service]' : 'addServiceCall',*/
				
				'click [data-add-service]' : 'addService',
				'click [data-service]' : 'servicedetail',
			},
			
			initialize : function()
			{
				// Create Services collection
				this.services = new Services();
				
				if(this.options.serviceid)
					return this.appendservice(this.options.serviceid)

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
			
			endload : function ()
			{
				//Remove?
				this.$el.find(".inner-loading").removeClass("inner-loading");	
			},

			appendservice : function(serviceid)
			{
				var service = new Service({id: serviceid});
				service.addservice();

				//this.listenTo(service, 'sync', this.updatechannels.bind(this, "add"));

				//service.fetch({parentpoint: false});


			},

			/*'updatechannels' : function(operation, service)
			{	
				var streams = service.get("streams");

				if(!streams)
					Router.Instance.navigate("#settings/services", true)

				for (var n in streams){
					this.parsestream(streams[n], operation);
				}

				//Refresh navigation
				RootView.navigation.renderHeader();
				RootView.navigation.render();

				if(operation == 'add')
					Router.Instance.navigate("#settings/services", true)
			},

			'parsestream' : function(stream, operation)
			{	
				var channels = stream.channels;
				var channel;
				
				if(channels.length){
					for (var n in channels){

						channel = Session.getChannel(parseInt(channels[n]));
						if(channel)
							channel.streams[operation](stream);
					}
				}

			},*/

			render : function ()
			{
				var account = Session.getAccount();
				var data = {};
				
				//Mustache translations
				data.translate_active_social_connections = this.translateString("active_social_connections");
				
				this.$el.html (Mustache.render (Templates.settings.services, data));
				
				/*// Get Service options
				Cloudwalkers.Net.get ('wizard/service/available', {'account': account.id}, this.appendOptions.bind(this));
				
				// Get connected Services
				Cloudwalkers.Net.get ('wizard/service/list', {'account': account.id}, this.appendConnected.bind(this));
				*/
				this.$container = this.$el.find('.portlet-body');
				return this;
			},
			
			appendOptions : function(services, available) {
				
				var $container = this.$el.find(".networks-list");
				
				for (var n in available)
				{
					available[n].translate_add = this.translateString("add");
					$container.append(Mustache.render (Templates.settings.service_option, available[n]));
				}
			},
			
			appendService : function(service) {
				
				// Add service attributes to list
				this.$el.find("ul.services").append(Mustache.render (Templates.settings.service_connected, service.attributes));
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
				
				this.services.create({},{wait: true, endpoint: token});

			},
			
			limited : function (collection) 
			{
				
				Session.getAccount().monitorlimit('services', collection.models.length, $(".networks-list"));	
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
				
				Session.getAccount().monitorlimit('networks', count, $(".service-options"));	
			},*/
			
			/*'addService' : function (id, callback)
			{
				Cloudwalkers.Net.post 
				(
					'wizard/service/add',
					{
						'account' : Session.getAccount ().get ('id')
					},
					{
						'id' : id
					},
					callback
				);
			},*/

			servicedetail : function (e)
			{
				// Navigate view
				this.$el.find("#service-connected").addClass("open-detail");
				
				// Create service view
				this.detail = new SettingsView.Service ({id: $(e.currentTarget).data("service"), parent: this});
				this.$el.find(".service-detail").html( this.detail.render().el);
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
						RootView.alert (data.error.message);
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

			},
			
			translateString : function(translatedata)
			{	
				// Translate String
				return Session.polyglot.t(translatedata);
			}
		});

		return Services;
});