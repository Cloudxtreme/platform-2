define(
	['Collections/BaseCollection', 'backbone', 'Session', 'Models/Service'],
	function (BaseCollection, Backbone, Session, Service)
	{
		var Services = BaseCollection.extend({

			model : Service,
			endpoint : "",

			initialize : function(){

				this.on('add', this.model.updateStreams)
			},
			
			url : function()
			{	
				return Session.api + '/accounts/' + Session.getAccount ().id + '/services' + this.endpoint;
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
			
			fetchAvailable : function (options)
			{
				this.fetch({endpoint: "available"});
			}
		});

		return Services;
});