Cloudwalkers.Models.User = Backbone.Model.extend({

	'typestring' : 'users',
	
	'initialize' : function ()
	{

	},
	
	'url' : function ()
	{
		if(this.parent)
        	return CONFIG_BASE_URL + 'json/' + this.parent.typestring + '/' + this.parent.id + "/" + this.typestring + "/" + this.id;
        
        else return CONFIG_BASE_URL + 'json/user/' + this.id;
        
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
	
	
	/*'parse' : function(response)
	{	
		// A new object
		if (typeof response == "number") response = {id: response};

		return response;
	},*/
	
	/*'sync' : function (method, model, options) {

		// Hack
		if(method == "update") return false;
		
		if( method == "read")
			Store.get(this.url(), null, function(data)
			{
				if(data) this.set(data);

			}.bind(this));

		
		return Backbone.sync(method, model, options);
	},*/
	
	'filterData' : function (type)
	{
		
		var data = this.attributes;
		
		if(type == "listitem")
		{
			data.arrow = true;
			
		} else {
			
			data.role = this.getRole();
		}

		return data;
	},

	'getcoworker' : function(roles)
	{
		
	},
	
	'getRole' : function ()
	{	
		var roles = Cloudwalkers.Session.getAccount().get('roles'); 	
		var userrole = this.get('rolegroup');

		var role = roles.filter(function(el){ return el.id == userrole});
		return role.length? role[0]: null;

		/*if (this.get ('level') == 10)
		{
			return 'Administrator';
		}
		else
		{
			return 'Co-worker';
		}*/
	}
});