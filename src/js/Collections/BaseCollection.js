define(
	['backbone'],
	function (Backbone)
	{
		/**
		 *	Collection functions
		 *
		 *	distantAdd 		saves all collection models to the global collections fo caching.
		 *	url				create Cloudwalkers API friendly parent model oriented endpoints
		 *	parse			handle Cloudwalkers API json tree and setcursor
		 *	setcursor		store current modelids cursor
		 *	touch logic		two-step id & object request, combined with stored cache
		 *	seed			get the models from cache, storage and/or fetch
		 *	more			get some more (cursor based)
		 *	ready			touch is completed, including fresh models data.
		 **/
		
		var BaseCollection = Backbone.Collection.extend({

			distantAdd : function(model)
			{
				if(!this.get(model.id)) this.add(model);	
			},
			
			url : function(a)
			{	
				// Get parent model
				if(this.parentmodel && !this.parenttype) this.parenttype = this.parentmodel.get("objectType");
				
				var url = (this.parentmodel)?
			
					Cloudwalkers.Session.api + '/' + this.parenttype + "/" + this.parentmodel.id :
					Cloudwalkers.Session.api + '/' + this.typestring;
						
				if(this.endpoint)	url += "/" + this.endpoint;
			
				return this.parameters? url + "?" + $.param (this.parameters): url;
			},
			
			parse : function (response)
			{	
				if(this.parentmodel && !this.parenttype)
					this.parenttype = this.parentmodel.get("objectType");
				
				// Solve response json tree problem
				if (this.parentmodel)
					response = response[this.parenttype];
				
				// Get paging
				if(response)
					this.setcursor(response.paging);
				
				// Ready?
				if(!response.paging) this.ready();
				
				return response[this.typestring];
			},
			
			sync : function (method, model, options)
			{
				return Backbone.sync(method, model, options);
			},
			
			setcursor : function (paging) {
				
				// Without paging, it's a models call (ignore)
				if(!paging) return false;
				
				this.cursor = paging.cursors? paging.cursors.after: false;
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
			},
			
			touch : function(model, params, seedparameters)
			{	
				// Work data
				this.parentmodel = model;
				this.endpoint = this.modelstring + "ids";
				this.parameters = params;

				this.seedparameters = seedparameters;

				// Hard-wired request (no caching)
				this.fetch({success: this.touchresponse.bind(this, this.url())});
			},
			
			touchlocal : function(touch)
			{
				// Is there a local touch list (and filled)?
				if (touch && touch.modelids.length)
				{
					this.cursor = touch.cursor;
					this.seed(touch.modelids);
					this.ready();
				
				} else this.fetch({success: this.touchresponse.bind(this, this.url())});
			},
			
			touchresponse : function(url, collection, response)
			{	
				// Get ids
				var ids = response[this.parenttype][this.typestring];

				// Store results based on url
				Store.set("touches", {id: url, modelids: ids, cursor: this.cursor, ping: Cloudwalkers.Session.getPing().cursor});
				
				// Seed ids to collection
				this.seed(ids);
			},
	
			
			/**
				Temp: non-caching seed
			**/
			seed : function(ids)
			{
				// Ignore empty id lists
				if(!ids) ids = [];
			
				var list = [];
				var fresh = _.compact( ids.map(function(id)
				{
					// In current Collection
					var model = this.get(id);
					
					// Or in Session collection
					if(!model)
						model = Cloudwalkers.Session.user.account[this.typestring].get (id);
					
					// Or create new
					if(!model) model = this.create({id: id});
					else this.add(model);
						
					list.push(model);
					
					return id;
				
				}, this));
						
				// Get list based on ids
				if(fresh.length)
				{
					this.endpoint = this.parentmodel? this.typestring: null;
					this.parameters = {ids: fresh.join(",")};

					if(this.seedparameters)
						$.extend(this.parameters, this.seedparameters);
					
					this.fetch({remove: false});
				}
				// Trigger listening models
				this.trigger("seed", list);
				
				return list;
			},
			
			more : function(model, params)
			{
				if(!this.cursor) return false;
				
				params.after = this.cursor;
				this.touch(model, params)
				
				return this;
			},
			
			ready : function()
			{	
				var collection = this;
				setTimeout(function(){ collection.trigger("ready", collection); }, 1, this);
			}
		});

		return BaseCollection;
	}
);