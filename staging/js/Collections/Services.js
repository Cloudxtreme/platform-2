define(
	['backbone', 'Session', 'Models/Service'],
	function (Backbone, Session, Service)
	{
		var Services = Backbone.Collection.extend({

			'model' : Service,
			'endpoint' : "",

			'initialize' : function(){

				this.on('add', this.model.updateStreams)
			},
			
			'url' : function()
			{	
				return Session.api + '/accounts/' + Session.getAccount ().id + '/services' + this.endpoint;
				// return CONFIG_BASE_URL + 'json/accounts/' + Session.getAccount ().id + '/services' + this.endpoint;
			},
			
			'parse' : function (response)
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
			
			'sync' : function (method, model, options)
			{
				options.headers = {
		            'Authorization': 'Bearer ' + Session.authenticationtoken,
		            'Accept': "application/json"
		        };
				
				this.endpoint = (options.endpoint)? "/" + options.endpoint: "";
				
				return Backbone.sync(method, model, options);
			},
			
			'fetchAvailable' : function (options)
			{
				this.fetch({endpoint: "available"});
			}
		});

		return Services;
});