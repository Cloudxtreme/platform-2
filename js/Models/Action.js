Cloudwalkers.Models.Action = Backbone.Model.extend({
	
	'typestring' : "actions",
	
	'initialize' : function(data, init)
	{
		// Get parent
		this.parent = init.collection.parent;
	},
	
	'url' : function()
	{	
		var url = [CONFIG_BASE_URL + "json"];
		
		if(this.parent)			url.push(this.parent.typestring, this.parent.id);
		if(this.typestring)		url.push(this.typestring);		
		if(this.id)				url.push(this.id);
		
		return url.join("/");
	},
	
	
	'parse' : function(data)
	{
		// Catch hierarchy
		if (this.parent) data = data[this.parent.get("objectType")];
		
		return data;
	}
	
	/*'url' : function ()
	{	
		// Parent and parameters
		var param = this.parameters? "?" + $.param (this.parameters): "";
		var parent = this.parent? this.parent.get("objectType") + "s/" + this.parent.id: "";
		
		return CONFIG_BASE_URL + 'json/' + parent + '/actions/' + this.get("token") + param;
	}*/
});