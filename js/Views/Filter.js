Cloudwalkers.Views.Filter = Backbone.View.extend({

	'collection' : null,

	'filters' : {},

	'initialize' : function (options)
	{
		var self = this;
		this.collection = options.collection;

		this.on ('filters:change', function ()
		{
			var filters = {};

			filters.types = [];
			filters.streams = [];

			for (var type in self.filters.types)
			{
				filters.types.push (type);
			}

			if (typeof (self.filters.streams) != 'undefined')
			{
				for (var channel in self.filters.streams)
				{
					filters.streams.push (channel);
				}
			}

			// Trnaslate filters to what the collection expects
			self.collection.setFilters (filters);
		});

		this.resetFilters ();
	},

	'render' : function ()
	{
		var data = {};

		var objData = {};

		if (this.collection.streams != null)
		{
			objData.streams = this.collection.streams;
		}
		else
		{
			objData.streams = Cloudwalkers.Session.getStreams ();
		}

		data.channels = [];
		for (var i = 0; i < objData.streams.length; i ++)
		{
			if (objData.streams[i].direction.INCOMING == 1)
			{
				data.channels.push (objData.streams[i]);
			}
		}

		this.$el.html (Mustache.render (Templates.filter, data));

		this.afterRender ();

		return this;
	},

	'resetFilters' : function ()
	{
		this.filters = { 'types' : { 'social' : true, 'web' : true }};
	},

	'afterRender' : function ()
	{
		var self = this;

		var all = this.$el.find('.view-all');
		var socialmedia = this.$el.find('.social-media');
		var webalerts = this.$el.find('.web-alerts');

		function allOff ()
		{
			all.removeClass ('on');
			all.addClass ('off');
		}

		all.click (function ()
		{
			self.resetFilters ();

			all.removeClass ('off');
			all.addClass ('on');

			socialmedia.addClass ('on').removeClass ('off');
			webalerts.addClass ('on').removeClass ('off');

			self.$el.find ('a.channel').addClass ('off').removeClass ('on');

			self.trigger ('filters:change');
		});

		socialmedia.click (function ()
		{
			if (typeof (self.filters.types) == 'undefined')
			{
				self.filters.types = {};	
			}

			if (socialmedia.hasClass ('on'))
			{
				allOff ();
				socialmedia.addClass ('off').removeClass ('on');

				if (typeof (self.filters.types['social']) != 'undefined')
				{
					delete self.filters.types['social'];
				}
			}

			else
			{
				socialmedia.addClass ('on').removeClass ('off');
				self.filters.types['social'] = true;
			}

			self.trigger ('filters:change');
		});

		webalerts.click (function ()
		{
			if (typeof (self.filters.types) == 'undefined')
			{
				self.filters.types = {};	
			}

			if (webalerts.hasClass ('on'))
			{
				allOff ();
				webalerts.addClass ('off').removeClass ('on');

				if (typeof (self.filters.types['web']) != 'undefined')
				{
					delete self.filters.types['web'];
				}
			}

			else
			{
				webalerts.addClass ('on').removeClass ('off');
				self.filters.types['web'] = true;
			}

			self.trigger ('filters:change');
		});

		// And then, all the channels
		this.$el.find ('a.channel').click (function ()
		{
			var channel = $(this);

			if (typeof (self.filters.streams) == 'undefined')
			{
				self.filters.streams = {};	
			}

			if (channel.hasClass ('on'))
			{
				channel.addClass ('off');
				channel.removeClass ('on');

				if (typeof (self.filters.streams[channel.attr ('data-id')]) != 'undefined')
				{
					delete self.filters.streams[channel.attr ('data-id')];
				}
			}
			else
			{
				allOff ();

				channel.addClass ('on');
				channel.removeClass ('off');

				self.filters.streams[channel.attr ('data-id')] = true;
			}

			self.trigger ('filters:change');
		});


	}

});