define(
	['backbone', 'Session', 'Collections/Users', 'Models/Contact'],
	function (Backbone, Session, Users, Contact)
	{
		var Contacts = Users.extend({

			model : Contact,
			typestring : "contacts",
			modelstring : "contact",
			parenttype : "account",
			comparator : 'displayname',
			processing : false,

			initialize : function (models, options)
			{				
				// Global collection gets created before session build-up
				if( Session.user.account)
				{
					Session.getContacts().listenTo(this, "add", Session.getContacts().distantAdd);
				}
			},
			
			url : function ()
		    {
				var url = [Session.api, "accounts", Session.getAccount ().id ];
				
				if(this.endpoint)	url.push(this.typestring, this.endpoint);
				if(this.following)	url.push(this.modelstring + "ids", this.following);		
				if(this.parameters)	url.push(this.typestring + "?" + $.param(this.parameters));
				
				return url.join("/");
				/*
				
				return this.endpoint?
					
					CONFIG_BASE_URL + 'json/accounts/' + Session.getAccount ().id + '/' + this.typestring + '/' + this.endpoint :
					CONFIG_BASE_URL + 'json/accounts/' + Session.getAccount ().id + '/' + this.typestring + (this.parameters? "/" + this.parameters: "");*/
		    },
		    
		    parse : function (response)
			{
				this.parameters = "";
				this.processing = false;
				
				return response[this.typestring]?
				
					response[this.typestring]: response.account[this.typestring];
			},
			    
		    sync : function (method, model, options)
			{
				options.headers = {
		            'Authorization': 'Bearer ' + Session.authenticationtoken,
		            'Accept': "application/json"
		        };
				
				
				if(method == "read")	this.processing = true;
				if(options.parameters)	this.parameters = options.parameters;
				if(!options.following)	this.following = false;

				return Backbone.sync(method, model, options);
			},
			
			touch : function(model, params)
			{
				// Exception for following
				if(!model) this.following = "following" + "?" + $.param(params);
				else {
				
					this.parentmodel = model;
					this.endpoint = this.modelstring + "ids";
					this.parameters = params;
				}

				// Check for history (within ping lifetime), temp disabled
				// Store.get("touches", {id: this.url(), ping: Session.getPing().cursor}, this.touchlocal.bind(this));
				
				// Hard-wired request (no caching)
				this.fetch({following: (!model), success: this.touchresponse.bind(this, this.url())});
			},
			
			
			updates : function (ids)
			{
				for (var n in ids)
				{
					var model = this.get(ids[n]);
					
					if(model && model.get("objectType"))
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
			}
		});

		return Contacts;
});