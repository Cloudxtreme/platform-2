Cloudwalkers.Models.Trigger = Backbone.Model.extend({
	
	'typestring' : "triggers",
	
	'initialize' : function()
	{

	},

	'getmessage' : function()
	{
		var message = this.get("actions")? this.get("actions")[0].message: null;
		
		return message? message.body.html: null;
	},
	
	'url' : function()
	{	
		var url = [CONFIG_BASE_URL + "json"];
		
		if(this.parent)				url.push(this.parent.typestring, this.parent.id, this.typestring);
		else if(this.typestring)	url.push(this.typestring);		
				
		return url.join("/");
	}
});