Cloudwalkers.Collections.Users = Backbone.Collection.extend({

	'model' : Cloudwalkers.Models.User,
	'processing' : false,

	'initialize' : function (models, options)
	{
		//this.filters = options.filters;
	},
	
	'url' : function()
	{
		return CONFIG_BASE_URL + 'json/account/' + Cloudwalkers.Session.getAccount ().id + '/users';
	},
	
	'parse' : function (response)
	{	
		Store.write(this.url(), [response.users]); 
		return response.users;
	},
	
	'sync' : function (method, model, options) {
		
		// Store Local
		if( method == "read")
			Store.get(this.url(), null, function(data)
			{
				if(data) this.add(data);

			}.bind(this));
		
		return Backbone.sync(method, model, options);
	},
	
	'hook' : function(callbacks)
	{
		if(callbacks.records) this.parameters.records = callbacks.records;
		
		
		if(!this.processing) this.fetch({error: callbacks.error});
		
		else if(this.length) callbacks.success(this);

		this.on("sync", callbacks.success);	
	},

	/*'sync' : function(method, model, options) 
	{
		var self = this;
		var passtrough = options.success;
		options.success = function (response)
		{
			var out = [];

			for (var i = 0; i < response.users.length; i ++)
			{
				var tmp = response.users[i].user;
				tmp.level = response.users[i].level;
				tmp.account = Cloudwalkers.Session.getAccount ().get ('id');
				out.push (tmp);
			}

			passtrough (out);
		}

		var fetch_url = CONFIG_BASE_URL + 'json/account/' + Cloudwalkers.Session.getAccount ().get ('id') + '/users?' + jQuery.param(this.filters);

		// Default JSON-request options.
		var params = _.extend({
			type:         'GET',
			dataType:     'json',
			url:			method == 'read' ? fetch_url : '',
			cache: false
		}, options);


		return $.ajax(params);
	}*/

});