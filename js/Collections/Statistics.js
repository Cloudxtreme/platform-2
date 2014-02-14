Cloudwalkers.Collections.Statistics = Backbone.Collection.extend({
	
	'model' : Cloudwalkers.Models.Statistic,
	'typestring' : "statistics",
	'modelstring' : "statistic",
	'processing' : false,
	'parameters' : {},
	'paging' : {},
	'cursor' : false,
	
	'initialize' : function(options){
		
		// Override type strings if required
		if (options) $.extend(this, options);
		
		// Put "add" listener to global messages collection
		if( Cloudwalkers.Session.user.account)
			Cloudwalkers.Session.getReports().listenTo(this, "add", Cloudwalkers.Session.getReports().distantAdd)
			
		console.log("statics collection triggered")
		
	},
	
	'distantAdd' : function(model)
	{
		if(!this.get(model.id)) this.add(model);	
	},
	
	'url' : function(a)
	{
		// Get parent model
		if(this.parentmodel && !this.parenttype) this.parenttype = this.parentmodel.get("objectType");
		
		var url = (this.parentmodel)?

			CONFIG_BASE_URL + "json/" + this.parenttype + "/" + this.parentmodel.id :
			CONFIG_BASE_URL + "json/"+ this.typestring;
				
		if(this.endpoint)	url += "/" + this.endpoint;

		return this.parameters? url + "?" + $.param (this.parameters): url;
	},
	
	'sync' : function (method, model, options) {
		
		this.processing = true;
		
		return Backbone.sync(method, model, options);
	},
	
	'parse' : function (response)
	{
		console.log("parsing collection", response)
		
		return response;	
	},
	
	'setcursor' : function (paging) {
		
		// Without paging, it's a messages call (ignore)
		if(!paging) return false;

		this.cursor = paging.cursors? paging.cursors.after: false;
	},
	
	'touch' : function(model, params)
	{
		// Work data
		this.parentmodel = model;
		this.endpoint = this.modelstring + "ids";
		this.parameters = params;
		
		// Check for history (within ping lifetime)
		Store.get("touches", {id: this.url()}, this.touchlocal.bind(this));
	},
	
	'touchlocal' : function(touch)
	{
		// Is there a local touch list (and filled)?
		if (touch && touch.modelids.length)
		{
			this.seed(touch.modelids);
		
		} else this.fetch({success: this.touchresponse.bind(this, this.url())});
	},
	
	'touchresponse' : function(url, collection, response)
	{
		// Get ids
		var ids = response[this.parenttype][this.typestring];
		
		// Store results based on url
		Store.set("touches", {id: url, modelids: ids, cursor: this.cursor});
	
		// Seed ids to collection
		this.seed(ids);
	},
	
	'seed' : function(ids)
	{

		// Ignore empty id lists
		if(!ids) ids = [];

		var list = [];
		var fresh = _.compact( ids.map(function(id)
		{
			model = Cloudwalkers.Session.getReport(id);
			
			this.add(model? model: {id: id});
			
			if(!model) model = this.get(id);
			
			list.push(model.stamp());
			
			if(!model || !model.get("objectType") || model.outdated) return id;
		
		}, this));
		
		// Get list based on ids
		if(fresh.length)
		{
			this.endpoint = this.parentmodel? this.typestring: null;
			this.parameters = {ids: fresh.join(",")};
			
			this.fetch();
		}
		
		// Trigger listening models
		this.trigger("seed", list);

		return list;
	}

	
});