Cloudwalkers.Collections.Comments = Cloudwalkers.Collections.Messages.extend({

	'id' : null,
	'model' : Cloudwalkers.Models.Comment,

	'nextPageParameters' : null,

	'canHaveFilters' : false,
	'filters' : {},

	'initialize' : function (options)
	{
		this.id = options.id;

		this.comparator = function (message1, message2)
		{
			return message1.date ().getTime () < message2.date ().getTime () ? 1 : -1;
		};
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
			self.nextPageParameters  = response.next;

			passtrough (response.message.children);
		}

		if (options.page)
		{
			var parameters = options.page;
		}
		else
		{
			// First load, load 50 records
			var parameters = { 'records' : 10 };
		}

		for (var filter in this.filters)
		{
			parameters[filter] = this.filters[filter].join (',');
		}

		var fetch_url = CONFIG_BASE_URL + 'json/message/' + this.id + '?account=' + Cloudwalkers.Session.getAccount ().get ('id') + '&' + jQuery.param (parameters);

		// Default JSON-request options.
		var params = _.extend({
			type:         'GET',
			dataType:     'json',
			url:			method == 'read' ? fetch_url : '',
			cache: false
		}, options);

		// Make the request.
		return $.ajax(params);
	},


	'update' : function (parameters)
	{
		if (typeof (parameters) == 'undefined')
		{
			parameters = {};
		}

		parameters.remove = false;
		this.fetch (parameters);
	}

});