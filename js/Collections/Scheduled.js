Cloudwalkers.Collections.Scheduled = Backbone.Collection.extend({

	'model' : Cloudwalkers.Models.Message,
	'name' : null,

	'nextPageParameters' : null,
	'canHaveFilters' : false,
	'filters' : {},

	'initialize' : function (models, options)
	{
		this.name = options.name;

		var d1;
		var d2;

		this.comparator = function (message1, message2)
		{
			d1 = message1.scheduledate (false);
			d2 = message2.scheduledate (false);

			return (d1 ? d1.getTime () : 0) > (d2 ? d2.getTime () : 0) ? 1 : -1;
		};
	},

	'sync' : function(method, model, options) 
	{
		var self = this;
		var passtrough = options.success;
		options.success = function (response)
		{
			//console.log (response);
			passtrough (response.messages);
		}

		var parameters = { };

		for (var filter in this.filters)
		{
			parameters[filter] = this.filters[filter].join (',');
		}

		var fetch_url = CONFIG_BASE_URL + 'json/account/' + Cloudwalkers.Session.getAccount ().get ('id') + '/scheduled?' + jQuery.param (parameters);

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

	'update' : function (parameters)
	{
		if (typeof (parameters) == 'undefined')
		{
			parameters = {};
		}

		parameters.remove = false;
		this.fetch (parameters);
	},

	/**
	* Load the amount of messages etc etc.
	*/
	'loadCounters' : function (callback)
	{
		$.ajax 
		(
			CONFIG_BASE_URL + 'json/account/' + Cloudwalkers.Session.getAccount ().get ('id') + '/scheduled/summary',
			{
				'success' : function (data)
				{
					callback (data);
				}
			}
		)
	}

});