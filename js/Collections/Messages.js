Cloudwalkers.Collections.Messages = Backbone.Collection.extend({
	
	'model' : Cloudwalkers.Models.Message,
	
	'initialize' : function(options)
	{
		this.channelid = options.id;
		this.endpoint = options.endpoint? options.endpoint: "channel";
		
		this.parameters = {
			records : options.records? options.records: 20,
			page : options.page? options.page: 1
		}
	},
	
	'url' : function()
	{		
		return CONFIG_BASE_URL + "json/" + this.endpoint + "/" + this.channelid + "?" + $.param (this.parameters);
	},
	
	'parse' : function (response)
	{
		return response.channel.messages;
	},
	
	'next' : function (params)
	{
		this.parameters.page ++;
		this.fetch(params);
	}
	
	/*'sync' : function(method, model, options)
	{
		return Backbone.sync(method, model, options);
	}*/
});