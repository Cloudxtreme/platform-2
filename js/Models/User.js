Cloudwalkers.Models.User = Backbone.Model.extend({
	
	'initialize' : function ()
	{

	},
	
	'url' : function ()
	{
		return CONFIG_BASE_URL + 'json/user/' + this.id;
	},
	
	'parse' : function(response)
	{	
		console.log(response);
		
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
	},

	'saveProfile' : function (callback)
	{
		var data = {firstname: this.get("firstname"), name: this.get("name"), avatar: this.get("avatarBase64")}
		
		Cloudwalkers.Net.put ('user/me', {}, data, callback);
	}
});