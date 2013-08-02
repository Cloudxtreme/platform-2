Cloudwalkers.Collections.Channel = Backbone.Collection.extend({

	'id' : null,
	'model' : Cloudwalkers.Models.Message,
	'name' : null,

	'nextPageParameters' : null,
	'streams' : null,

	'canHaveFilters' : true,
	'filters' : {},

	'_cancelCallback' : false,

	'initialize' : function (models, options)
	{
		this.id = options.id;
		this.name = options.name;
		this.amount = (typeof (options.amount) == 'undefined' ? 50 : options.amount);

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
			if (options.resumeCallback)
			{
				self._cancelCallback = false;				
			}

			if (!self._cancelCallback)
			{
				Cloudwalkers.Utilities.StreamLibrary.parseFromChannel (response.channel.streams);
				
				// Set the next page
				self.nextPageParameters  = response.channel.next;

				self.streams = response.channel.streams;

				//console.log (response);
				passtrough (response.channel.messages);
			}
		}

		if (options.page)
		{
			var parameters = options.page;
		}
		else
		{
			// First load, load 50 records
			var records = self.amount;
			var parameters = { 'records' : records };
		}

		for (var filter in this.filters)
		{
			parameters[filter] = this.filters[filter].join (',');
		}

		var fetch_url = CONFIG_BASE_URL + 'json/channel/' + this.id + '?' + jQuery.param (parameters);

		// Default JSON-request options.
		var params = _.extend({
			type:         'POST',
			dataType:     'json',
			url:			method == 'read' ? fetch_url : '',
			cache: false
		}, options);

		// Make the request.
		return $.ajax(params);
	},

	'setFilters' : function (filters)
	{
		this._cancelCallback = true;

		this.filters = filters;
		
		this.reset ();
		this.fetch ({ 'resumeCallback' : true });
	},

	'update' : function ()
	{
		this.fetch ({ 'remove' : false });
	}

});