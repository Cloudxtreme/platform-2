Cloudwalkers.Collections.Channel = Backbone.Collection.extend({

	'id' : null,
	'model' : Cloudwalkers.Models.Message,

	'nextPageParameters' : null,

	'initialize' : function (models, options)
	{
		this.id = options.id;
	},

	'loadMore' : function (options)
	{
		var onDone = function () {};
		if (typeof (options.success) != 'undefined')
		{
			onDone = options.success;
		}

		var self = this;
		if (this.nextPageParameters)
		{
			this.fetch ({ 
				'remove' : false,
				'page' : this.nextPageParameters,
				'success' : function ()
				{
					//self.trigger ('refresh');
					onDone ();
				}
			});
		}
	},

	'sync' : function(method, model, options) 
	{
		var self = this;
		var passtrough = options.success;
		options.success = function (response)
		{
			// Set the next page
			self.nextPageParameters  = response.channel.next;

			//console.log (response);
			passtrough (response.channel.messages);
		}

		if (options.page)
		{
			var parameters = options.page;
		}
		else
		{
			// First load, load 20 records
			var parameters = { 'records' : 20 };
		}

		var fetch_url = CONFIG_BASE_URL + 'json/channel/' + this.id + '?' + jQuery.param (parameters);

		// Default JSON-request options.
		var params = _.extend({
			type:         'POST',
			dataType:     'json',
			url:			method == 'read' ? fetch_url : '',
		}, options);

		// Make the request.
		return $.ajax(params);
	}

});