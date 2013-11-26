Cloudwalkers.Collections.Reports = Backbone.Collection.extend({
	
	'model' : Cloudwalkers.Models.Report,
	'processing' : false,
	
	'initialize' : function(){
		
		
	},
	
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

	
});