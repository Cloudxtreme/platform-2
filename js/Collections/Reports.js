Cloudwalkers.Collections.Reports = Backbone.Collection.extend({
	
	'model' : Cloudwalkers.Models.Report,
	'typestring' : "reports",
	'modelstring' : "report",
	'processing' : false,
	'parameters' : {complete: 1},
	'paging' : {},
	'cursor' : false,
	
	'initialize' : function(options){
		
		// Override type strings if required
		if (options) $.extend(this, options);
		
		// Put "add" listener to global messages collection
		if( Cloudwalkers.Session.user.account)
			Cloudwalkers.Session.getReports().listenTo(this, "add", Cloudwalkers.Session.getReports().distantAdd)
		
	},
	
	'distantAdd' : function(model)
	{
		if(!this.get(model.id)) this.add(model);	
	},
	
	/*'url' : function(a)
	{
		// Hack
		if(this.parentmodel && !this.parenttype) this.parenttype = this.parentmodel.get("objectType");
		
		// Get parent model
		var url = (this.parentmodel)?

			CONFIG_BASE_URL + "json/" + this.parenttype + "/" + this.parentmodel.id :
			CONFIG_BASE_URL + "json/"+ this.typestring;
				
		if(this.endpoint)	url += "/" + this.endpoint;

		return this.parameters? url + "?" + $.param (this.parameters): url;
	},*/
	
	
	'url' : function()
	{
		return CONFIG_BASE_URL + 'json/stream/' + this.streamid + '/reports?complete=1';
	},
	
	'parse' : function (response)
	{
		for(n in response.reports) response.reports[n].streamid = this.streamid;
		
		return response.reports;
	},
	
	'sync' : function (method, model, options) {
		
		this.processing = true;
		
		return Backbone.sync(method, model, options);
	},
	
	'hook' : function(callbacks)
	{
		if(!this.processing) this.fetch({error: callbacks.error});
		
		else if(this.length) callbacks.success();

		this.on("sync", callbacks.success);	
	}

	
});