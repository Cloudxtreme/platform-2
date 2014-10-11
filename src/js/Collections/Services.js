define(
	['Collections/BaseCollection', 'backbone',  'Models/Service'],
	function (BaseCollection, Backbone, Service)
	{
		var Services = BaseCollection.extend({

			model : Service,
			endpoint : "",

			initialize : function(){

				this.on('add', this.model.updateStreams)
			},
			
			url : function()
			{	
				return Cloudwalkers.Session.api + '/accounts/' + Cloudwalkers.Session.getAccount ().id + '/services' + this.endpoint;
			},
			
			parse : function (response)
			{
				// Hold available endpoint contained
				if(response.services)
				{
					// Store
					this.available = response.services.available;
					this.trigger("available:ready", this, response.services.available);

				} else {
					
					this.ready();
					return response.account.services;
				}
			},
			
			sync : function (method, model, options)
			{				
				this.endpoint = (options.endpoint)? "/" + options.endpoint: "";
				
				return Backbone.sync(method, model, options);
			},
			
			/*
			 *	Get the available networks
			 */
			fetchAvailable : function (options)
			{
				this.fetch({endpoint: "available"});
			}
		});

		return Services;
});