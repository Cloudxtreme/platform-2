define(
	['backbone'],
	function (Backbone)
	{
		/**
		 *	Model functions
		 *
		 *	url				create Cloudwalkers API friendly endpoints
		 *	parse			pepare incoming object
		 *	sync			handle fetch requests and prevent trigger-happy update requests
	  	 *	stamp			add timestamp to model and store
		 **/
		
		var BaseModel = Backbone.Model.extend({
	
			'url' : function (params)
		    {
		        return this.endpoint?
		        	Cloudwalkers.Session.api + '/' + this.typestring + '/' + this.id + this.endpoint :
		        	Cloudwalkers.Session.api + '/' + this.typestring + '/' + this.id;

		    },
		    
		    'parse' : function(response)
			{	
				// A new object
				if (typeof response == "number") response = {id: response};
				
				// Store incoming object
				else this.stamp(response);

				return response;
			},
		    
		    'sync' : function (method, model, options)
			{				
				this.endpoint = (options.endpoint)? "/" + options.endpoint: false;
				
				// Hack
				if(method == "update") return false;
				
				return Backbone.sync(method, model, options);
			},
			
			'stamp' : function(params)
			{
				if (!params) params = {id: this.id};
				
				params.stamp = Math.round(new Date().getTime() *0.001)
				
				Store.set(this.typestring, params);
				
				return this;
			},
			
			'loaded' : function(param)
			{
				return this.get(param? param: "objectType") !== undefined;
			}
		});

		return BaseModel;
	}
);