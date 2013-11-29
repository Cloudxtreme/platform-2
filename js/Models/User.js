Cloudwalkers.Models.User = Backbone.Model.extend({
	
	'parse' : function (response)
	{
		Store.write(this.url(), [response.user]);
		return response.user;
	},

	'url' : function ()
	{
		return CONFIG_BASE_URL + 'json/user/' + this.id;
	},
	
	'sync' : function (method, model, options) {
		
		if( method == "read")
			Store.get(this.url(), null, function(data)
			{
				if(data) this.set(data);

			}.bind(this));
		
		return Backbone.sync(method, model, options);
	},
	
	'getRole' : function ()
	{
		if (this.get ('level') == 10)
		{
			return 'Administrator';
		}
		else
		{
			return 'User';
		}
	},

	'save' : function (callback)
	{
		var data = {firstname: this.get("firstname"), name: this.get("name"), avatar: this.get("avatarBase64")}
		
		Cloudwalkers.Net.put ('user/me', {}, data, callback);
	}
});