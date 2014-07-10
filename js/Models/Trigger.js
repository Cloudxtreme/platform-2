Cloudwalkers.Models.Trigger = Backbone.Model.extend({
	
	'typestring' : "trigger",
	
	'initialize' : function()
	{

	},
	
	'url' : function()
	{	
		var url = [CONFIG_BASE_URL + "json"];
		
		if(this.parent)				url.push(this.parent.typestring, this.parent.id, this.typestring);
		else if(this.typestring)	url.push(this.typestring);		
				
		return url.join("/");
	}
});