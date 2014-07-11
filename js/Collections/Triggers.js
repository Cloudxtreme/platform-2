Cloudwalkers.Collections.Triggers = Backbone.Collection.extend({

	'model' : Cloudwalkers.Models.Trigger,
	'typestring' : "triggers",
	
	'initialize' : function()
	{
		
	},

	'parse' : function (response)
	{	
		return response.account.triggers;
	},
	
	'url' : function()
	{
		
		var url = [CONFIG_BASE_URL + "json"];
		
		if(this.parent)				url.push(this.parent.typestring, this.parent.id, this.typestring);
		else if(this.typestring)	url.push(this.typestring);		
				
		return url.join("/");
	},

});