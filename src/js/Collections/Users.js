define(
	['backbone', 'Session', 'Models/User'],
	function (Backbone, Session, User)
	{
		var Users = Backbone.Collection.extend({

			model : User,
			typestring : "users",
			modelstring : "user",
			parenttype : "account",
			processing : false,

			
			initialize : function(options)
			{
				if(!Session)	Session = require('Session');
				
				// Override type strings if required
				if(options) $.extend(this, options);
				
				// Put "add" listener to global users collection
				if( Session.user.account)
					Session.getUsers().listenTo(this, "add", Session.getUsers().distantAdd);	
			},
			
			parse : function (response)
			{
				
				// Solve response json tree problem
				if (this.parentmodel)
					response = response[this.parenttype];
			
				// Get paging
				if(response) this.setcursor(response.paging);
				
				// Ready?
				if(!response.paging) this.ready();

				this.processing = false;
				
				return response[this.typestring];
			},
			
			url : function()
			{
				return Session.api + '/account/' + Session.getAccount ().id + '/' + this.typestring + this.parameters;
				// return CONFIG_BASE_URL + 'json/account/' + Session.getAccount ().id + '/' + this.typestring + this.parameters;
			},
			
			sync : function (method, model, options)
			{
				options.headers = {
		            'Authorization': 'Bearer ' + Session.authenticationtoken,
		            'Accept': "application/json"
		        };
				
				if(method == "read")
				{
					this.processing = true;
					this.parameters = this.parameters? "?" + $.param(this.parameters): "";
					
		            //Overrrding default params with fetch specif params
		            if(options.parameters)    this.parameters = "?" + $.param(options.parameters);

				}

				return Backbone.sync(method, model, options);
			},
			
			/*'parse' : function (response)
			{
				this.parameters = "";
				this.processing = false;
				
				return response[this.typestring]?
				
					response[this.typestring]: response.account[this.typestring];
			},*/
			
			/*'distantAdd' : function(model)
			{
				if(!this.get(model.id)) this.add(model);	
			},*/
			
			/*'sync' : function (method, model, options) {
				
				// Store Local
				if( method == "read")
					Store.get(this.url(), null, function(data)
					{
						if(data) this.add(data);

					}.bind(this));
				
				return Backbone.sync(method, model, options);
			},*/
			
			updates : function (ids)
			{
				for (var n in ids)
				{
					var model = this.get(ids[n]);
					
					if(model)
					{
						// Store with outdated parameter
						Store.set(this.typestring, {id: ids[n], outdated: true});
						
						// Trigger active models
						model.outdated = true;
						model.trigger("outdated");
					}
				}
			},

			outdated : function(id)
			{
				// Collection
				if(!id) return this.filter(function(model){ return model.outdated});
				
				// Update model
				var model = this.updates([id]);
			},
			
			/*'touchresponse' : function(url, collection, response)
			{
				// Get ids
				var ids = response.account[this.typestring];
				
				// Store results based on url
				Store.set("touches", {id: url, modelids: ids, cursor: this.cursor, ping: Session.getPing().cursor});
			
				// Seed ids to collection
				this.seed(ids);
			},*/
			
			hook : function(callbacks)
			{
				if(callbacks.records) this.parameters.records = callbacks.records;
				
				
				if(!this.processing) this.fetch({error: callbacks.error});
				
				else if(this.length) callbacks.success(this);

				this.on("sync", callbacks.success);	
			}

		});

		return Users;
});