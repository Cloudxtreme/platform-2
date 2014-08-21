var Cloudwalkers = {
	
	'version' : 1,
	
	'Views' : {
		'Settings': {},
		'Widgets' : {
			'Charts' : {}
		}
	},
	'Router' : {},
	'Models' : {},
	'Collections' : {},
	'Utilities' : {},

	'init' : function ()
	{

		// Check if there is authentication
		Store.get("settings", {key: "token"}, function(entry)
		{
			Cloudwalkers.Session.authenticationtoken = entry? entry.value: undefined;
			
			if(!entry) window.location = "/login.html";
		});
		
		// Define API root
		Cloudwalkers.Session.api = config.api[window.location.origin] + Cloudwalkers.version;
		
		// First load essential user data
		Cloudwalkers.Session.loadEssentialData (function ()
		{
			// Root view
			Cloudwalkers.RootView = new Cloudwalkers.Views.Root();
			
			// Url Shortener
			Cloudwalkers.Session.UrlShortener = new Cloudwalkers.UrlShortener();

			// And then rout the router.
			Cloudwalkers.Router.Instance = new Cloudwalkers.Router ();
			Backbone.history.start();

		});
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
	
	'url' : function (params)
    {
        return this.endpoint?
        	Cloudwalkers.Session.api + '/' + this.typestring + '/' + this.id + this.endpoint :
        	Cloudwalkers.Session.api + '/' + this.typestring + '/' + this.id;
        	
        	// CONFIG_BASE_URL + 'json/' + this.typestring + '/' + this.id + this.endpoint :
        	// CONFIG_BASE_URL + 'json/' + this.typestring + '/' + this.id;
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
		options.headers = {
            'Authorization': 'Bearer ' + Cloudwalkers.Session.authenticationtoken,
            'Accept': "application/json"
        };
		
		this.endpoint = (options.endpoint)? "/" + options.endpoint: false;
		
		// Hack
		if(method == "update") return false;
		
		return Backbone.sync(method, model, options);
	},
	
	'stamp' : function(params)
	{
		if (!params) params = {id: this.id};
		
		params.stamp = Math.round(new Date().getTime() *.001)
		
		Store.set(this.typestring, params);
		
		return this;
	},
	
	'loaded' : function(param)
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

	'distantAdd' : function(model)
	{
		if(!this.get(model.id)) this.add(model);	
	},
	
	'url' : function(a)
	{	
		// Get parent model
		if(this.parentmodel && !this.parenttype) this.parenttype = this.parentmodel.get("objectType");
		
		var url = (this.parentmodel)?
	
			Cloudwalkers.Session.api + '/' + this.parenttype + "/" + this.parentmodel.id :
			Cloudwalkers.Session.api + '/' + this.typestring;
				
		if(this.endpoint)	url += "/" + this.endpoint;
	
		return this.parameters? url + "?" + $.param (this.parameters): url;
	},
	
	'parse' : function (response)
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
	
	'sync' : function (method, model, options)
	{
		options.headers = {
            'Authorization': 'Bearer ' + Cloudwalkers.Session.authenticationtoken,
            'Accept': "application/json"
        };
		
		return Backbone.sync(method, model, options);
	},
	
	'setcursor' : function (paging) {
		
		// Without paging, it's a models call (ignore)
		if(!paging) return false;
	
		this.cursor = paging.cursors? paging.cursors.after: false;
	},
	
	'updates' : function (ids)
	{
		for(n in ids)
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

	'outdated' : function(id)
	{
		// Collection
		if(!id) return this.filter(function(model){ return model.outdated});
		
		// Update model
		var model = this.updates([id]);
	},
	
	'touch' : function(model, params)
	{	
		// Work data
		this.parentmodel = model;
		this.endpoint = this.modelstring + "ids";
		this.parameters = params;

		// Check for history (within ping lifetime), temp disabled
		// Store.get("touches", {id: this.url(), ping: Cloudwalkers.Session.getPing().cursor}, this.touchlocal.bind(this));
		
		// Hard-wired request (no caching)
		this.fetch({success: this.touchresponse.bind(this, this.url())});
	},
	
	'touchlocal' : function(touch)
	{
		// Is there a local touch list (and filled)?
		if (touch && touch.modelids.length)
		{
			this.cursor = touch.cursor;
			this.seed(touch.modelids);
			this.ready();
		
		} else this.fetch({success: this.touchresponse.bind(this, this.url())});
	},
	
	'touchresponse' : function(url, collection, response)
	{	
		// Get ids
		var ids = response[this.parenttype][this.typestring];

		// Store results based on url
		Store.set("touches", {id: url, modelids: ids, cursor: this.cursor, ping: Cloudwalkers.Session.getPing().cursor});
		
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
				model = Cloudwalkers.Session.user.account[this.typestring].get (id);
			
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
			
			this.fetch({remove: false});
		}
		// Trigger listening models
		this.trigger("seed", list);
		
		return list;
	},
	
	'more' : function(model, params)
	{
		if(!this.cursor) return false;
		
		params.after = this.cursor;
		this.touch(model, params)
		
		return this;
	},
	
	'ready' : function()
	{	
		setTimeout(function(collection){ collection.trigger("ready", collection); }, 1, this);
	}
});