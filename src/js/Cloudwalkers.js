define(
	// MIGRATION
	['backbone', /*'Session', 'Router', 'config', 'Views/Root'*/],
	function (Backbone, Session/*, Router, config, RootView*/)
	{
		var Cloudwalkers = {
			
			version : 1,
			
			Views : {
				'Settings': {},
				'Widgets' : {
					'Charts' : {}
				}
			},
			Router : {},
			Models : {},
			Collections : {},
			Utilities : {},

			init : function ()
			{
				// Authentication
				var token = window.localStorage.getItem('token');
				
				// Check if there is authentication
				if(token && token.length > 9)
				{	
					Session.authenticationtoken = token;
					
				} else{ console.log("token error", token); window.location = "/login.html";}

				// Define API root
				Session.api = config.apiurl + Cloudwalkers.version;
				
				// MIGRATION
				// First load essential user data
				Cloudwalkers.RootView = new RootView();
				/*Session.loadEssentialData (function ()
				{
					// Root view
					Cloudwalkers.RootView = new RootView();
					
					// Url Shortener
					Session.UrlShortener = new Cloudwalkers.UrlShortener();

					// And then rout the router.
					Router.Instance = new Router ();
					Backbone.history.start();

				});*/

				return this;
			}
		};

		/**
		 *	Cloudwalkers level Exceptions
		 **/

		function AuthorizationError (message)
		{
			this.name = "Not Authorized";
			this.message = (message || "Not authorized for the current user (no matching authorization token)")
			this.stack = (new Error()).stack;
		}

		AuthorizationError.prototype = new Error();
		AuthorizationError.prototype.constructor = AuthorizationError;


		/**
		 *	Backbone Extensions
		 **/
		 
		/*
		 *	Add authorization headers to each Backbone.sync call
		 */
		Backbone.ajax = function()
		{
			// Is there a auth token?
			if(Session.authenticationtoken)
				
				arguments[0].headers = {
		            'Authorization': 'Bearer ' + Session.authenticationtoken,
		            'Accept': "application/json"
		        };
		        
			return Backbone.$.ajax.apply(Backbone.$, arguments);
		};
		 
		/*Backbone.View = Backbone.View.extend({

			'hasContainer' : false,
			
			'loadListeners' : function(model, states){
				var length = states.length;

				for(i in states){
					this.listenTo(model, states[i], this.loadRender.bind(this, Number(i)+1, length));
				}
				//Add the progress-bar dinamicaly
				this.on("rendered", this.addLoader);
			},

			'addLoader' : function(){
				this.container = this.$loadercontainer ? this.$loadercontainer : this.$container;
				this.loader = $(Templates.progressbar).appendTo(this.container);
			},

			'loadRender' : function(index, length){
				//Just to make it moving from the beggining
				if(!this.loader) return;

				if(this.loader && this.loader.hasClass('loaded'))	this.restart();
				if(this.loader && this.loader.hasClass('loading') && index == 1)	this.restart();
				if(length == index){
					this.finishLoading();
				} 
				
				var dis = this;
				// Ugly but needed hack
				setTimeout(function(){
					var width = index*100/length;

					if(!dis.loadingstate || dis.loadingstate <= width){
						dis.loadingstate = width;
						if(dis.loader)	dis.loader.css('width',width+'%');
					}else{
						dis.restart();
					}		
				},1);
			},

			'restart' : function(){
				this.loadingstate = 0;
				this.loader.remove();
				this.addLoader();
				this.container.removeClass('loaded').addClass('toload');
			},

			'finishLoading' : function(){
				this.loader.css('width','100%');
				this.loader.addClass('loaded');
				this.container.removeClass('toload').addClass('loaded');
			}
		});*/

		 
		 /**
		 *	Model functions
		 *
		 *	url				create Cloudwalkers API friendly endpoints
		 *	parse			pepare incoming object
		 *	sync			handle fetch requests and prevent trigger-happy update requests
		 *	stamp			add timestamp to model and store
		 **/

		Backbone.Model = Backbone.Model.extend({
			
			url : function (params)
		    {
		        return this.endpoint?
		        	Session.api + '/' + this.typestring + '/' + this.id + this.endpoint :
		        	Session.api + '/' + this.typestring + '/' + this.id;
		        	
		        	// CONFIG_BASE_URL + 'json/' + this.typestring + '/' + this.id + this.endpoint :
		        	// CONFIG_BASE_URL + 'json/' + this.typestring + '/' + this.id;
		    },
		    
		    parse : function(response)
			{	
				// A new object
				if (typeof response == "number") response = {id: response};
				
				// Store incoming object
				else this.stamp(response);

				return response;
			},
		    
		    sync : function (method, model, options)
			{
				this.endpoint = (options.endpoint)? "/" + options.endpoint: false;
				
				// Hack
				if(method == "update") return false;
				
				return Backbone.sync(method, model, options);
			},
			
			stamp : function(params)
			{
				if (!params) params = {id: this.id};
				
				params.stamp = Math.round(new Date().getTime() *.001)
				
				Store.set(this.typestring, params);
				
				return this;
			},
			
			loaded : function(param)
			{
				return this.get(param? param: "objectType") !== undefined;
			}
		});

		 
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

		Backbone.Collection = Backbone.Collection.extend({

			distantAdd : function(model)
			{
				if(!this.get(model.id)) this.add(model);	
			},
			
			url : function(a)
			{	
				// Get parent model
				if(this.parentmodel && !this.parenttype) this.parenttype = this.parentmodel.get("objectType");
				
				var url = (this.parentmodel)?
			
					Session.api + '/' + this.parenttype + "/" + this.parentmodel.id :
					Session.api + '/' + this.typestring;
						
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
			
			// seedparameters: parameters for the second fecth(ids)
			touch : function(model, params, seedparameters)
			{	
				// Work data
				this.parentmodel = model;
				this.endpoint = this.modelstring + "ids";
				this.parameters = params;

				this.seedparameters = seedparameters;

				// Check for history (within ping lifetime), temp disabled
				// Store.get("touches", {id: this.url(), ping: Session.getPing().cursor}, this.touchlocal.bind(this));
				
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
				Store.set("touches", {id: url, modelids: ids, cursor: this.cursor, ping: Session.getPing().cursor});
				
				// Seed ids to collection
				this.seed(ids);
			},
			
			/**
			 *	Caching seed
			
			'seed' : function(ids)
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
						model = Session.user.account[this.typestring].get (id);
					
					// Or create new
					if(!model) model = this.create({id: id});
					else this.add(model);
						
					list.push(model);
					
					if(model.get("objectType") && !model.outdated) model.stamp();
					else return id;
				
				}, this));
				
				// Get list based on ids
				if(fresh.length)
				{
					this.endpoint = this.parentmodel? this.typestring: null;
					this.parameters = {ids: fresh.join(",")};
					
					this.fetch({remove: false});
				}
				
				// Trigger listening models
				this.trigger("seed", list);
				
				//Trigger cached, partial or empty load
				//if (fresh.length && fresh.length != ids.length)	this.trigger("cached:partial", this, list);
				//else if (!fresh.length && ids.length)			this.trigger("cached", this, list);
				//else if (!ids.length)							this.trigger("cached:empty", this, list);

				return list;
			},*/
			
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
						model = Session.user.account[this.typestring].get (id);
					
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

	return Cloudwalkers;
	
	});