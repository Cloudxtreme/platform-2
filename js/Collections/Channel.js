/**
 *	Deprecated, remove Router instances first.
 **/

Cloudwalkers.Collections.Channel = Backbone.Collection.extend({

	'id' : null,
	'model' : Cloudwalkers.Models.Message,
	'name' : null,

	'nextPageParameters' : null,
	'streams' : null,

	'canHaveFilters' : true,
	'filters' : {},
	'canLoadMore' : true,
	'showMoreButton' : false,

	'_cancelCallback' : false,

	'fetch_url' : 'json/channel/',

	'since' : null,

	'initialize' : function (models, options)
	{
		var self = this;

		this.id = options.id;
		this.name = options.name;
		this.amount = (typeof (options.amount) == 'undefined' ? 50 : options.amount);

		this.canLoadMore = (typeof (options.canLoadMore) == 'undefined' ? true : options.canLoadMore);
		this.showMoreButton = (typeof (options.showMoreButton) == 'undefined' ? false : options.showMoreButton);

		this.setComparator ();

		if (typeof (options.since) != 'undefined')
		{
			this.since = options.since;
		}

		// On change model date
		this.on ('change:date', function () { self.sort (); });
	},

	'setComparator' : function ()
	{
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

	'getStreams' : function (callback, allOfThem)
	{
		if (typeof (allOfThem) == 'undefined')
		{
			allOfThem = false;
		}

		var fetch_url;
		if (allOfThem)
		{
			fetch_url = CONFIG_BASE_URL + this.fetch_url + this.id + '/streams?descendants=1';
		}
		else
		{
			fetch_url = CONFIG_BASE_URL + this.fetch_url + this.id + '/streams?descendants=0';	
		}

		var options = {};

		options.success = function (data)
		{
			if (typeof (data.streams) != 'undefined')
			{
				callback (data.streams);
			}
			else
			{
				callback ([]);
			}
		};

		// Default JSON-request options.
		var params = _.extend({
			type:         'GET',
			dataType:     'json',
			url:		fetch_url,
			cache: false
		}, options);

		return $.ajax(params);
	},


	'getChannels' : function (callback)
	{
		var channel = Cloudwalkers.Session.getChannel (this.id);
		callback (channel);
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

			if (!self._cancelCallback || true) // ignore for now.
			{
				if (typeof (response.channel) != 'undefined')
				{
					
					Cloudwalkers.Utilities.StreamLibrary.parseFromChannel (response.channel.streams);
				
					// Set the next page
					self.nextPageParameters  = response.channel.next;

					self.streams = response.channel.streams;

					passtrough (response.channel.messages);
				}
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

		if (this.since)
		{
			parameters.since = Math.floor (this.since.getTime () / 1000);
		}

		var fetch_url = CONFIG_BASE_URL + this.fetch_url + this.id + '?' + jQuery.param (parameters);

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

	'getFilters' : function (filters)
	{
		return this.filters;
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
