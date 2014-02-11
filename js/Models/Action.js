Cloudwalkers.Models.Action = Backbone.Model.extend({
	
	'initialize' : function(data, init)
	{
		// Get parent
		this.parent = init.collection.parent;
	},
	
	
	'parse' : function(data)
	{
		// Catch hierarchy
		if (this.parent) data = data[this.parent.get("objectType")];
		
		return data;
	},
	
	'url' : function ()
	{	
		// Parent and parameters
		var param = this.parameters? "?" + $.param (this.parameters): "";
		var parent = this.parent? this.parent.get("objectType") + "s/" + this.parent.id: "";
		
		return CONFIG_BASE_URL + 'json/' + parent + '/actions/' + this.get("token") + param;
	},
});