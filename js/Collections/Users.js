Cloudwalkers.Collections.Users = Backbone.Collection.extend({

	'model' : Cloudwalkers.Models.User,
	'filters' : null,

	'initialize' : function (models, options)
	{
		this.filters = options.filters;
	},

	'sync' : function(method, model, options) 
	{
		console.log (method);
		console.log (model);
		console.log (options);

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

			//console.log (response);
			passtrough (out);
		}

		var fetch_url = CONFIG_BASE_URL + 'json/account/' + Cloudwalkers.Session.getAccount ().get ('id') + '/users?' + jQuery.param(this.filters);

		// Default JSON-request options.
		var params = _.extend({
			type:         'GET',
			dataType:     'json',
			url:			method == 'read' ? fetch_url : '',
		}, options);

		// Make the request.
		return $.ajax(params);
	}

});