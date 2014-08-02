Cloudwalkers.Models.Group = Backbone.Model.extend({
	
	
	'initialize' : function ()
	{

	},
	
	'url' : function ()
	{
		if(this.parent)
        	return CONFIG_BASE_URL + 'json/' + this.parent.typestring + '/' + this.parent.id + "/" + this.typestring + "/" + this.id;
        
        else return CONFIG_BASE_URL + 'json/group/' + this.id;
        
       /* return this.endpoint?
        
        	CONFIG_BASE_URL + 'json/' + this.typestring + '/' + this.id + this.endpoint :
        	CONFIG_BASE_URL + 'json/' + this.typestring + '/' + this.id;*/
	},
	
	'parse' : function(response)
	{	
		// A new object
		if (typeof response == "number") response = {id: response};
		
		// Store incoming object
		else this.stamp(response);

		return response;
	},
	
	'filterData' : function (type)
	{
		
		var data = this.attributes;
		
		if(type == "listitem")
		{
			data.arrow = true;
			
		} else {
			
			data.role = this.getRole().name;
		}

		return data;
	},
	
	'getRole' : function ()
	{
		if (this.get ('level') == 10)
		{
			return 'Administrator';
		}
		else
		{
			return 'Co-worker';
		}
	}
});