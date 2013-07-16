Cloudwalkers.Views.MessageContainer = Backbone.View.extend({

	'events' : {
		'click .load-more a' : 'loadMore'
	},

	'canLoadMore' : true,
	'hasFilter' : true,
	'interval' : null,
	'filterview' : null,

	'initialize' : function (options)
	{
		if (typeof (options.canLoadMore) != 'undefined')
		{
			this.canLoadMore = options.canLoadMore;
		}

		if (typeof (options.hasFilter) != 'undefined')
		{
			this.hasFilter = options.hasFilter;
		}

		this.bind ('destroy', this.destroy, this);

		this.options.channel.comparator = function (message1, message2)
		{
			return message1.date ().getTime () < message2.date ().getTime () ? 1 : -1;
		};
	},

	'loadMore' : function ()
	{
		var self = this;

		// Hide the load button
		this.options.channel.loadMore ({
			'success' : function ()
			{
				self.$el.find ('.loading').hide ();
				self.$el.find ('.load-more').show ();
			}
		});

		this.$el.find ('.loading').show ();
		this.$el.find ('.load-more').hide ();
	},

	'render' : function ()
	{
		var self = this;
		var data = {};

		data.title = this.options.channel.name;

		$(this.el).html (Mustache.render (Templates.messagecontainer, data));

		this.$el.find ('.load-more').hide ();
		this.$el.find ('.loading').show ();

        this.options.channel.bind('add', this.addOne, this);
        this.options.channel.bind('refresh', this.refresh, this);
        this.options.channel.bind('reset', this.refresh, this);
        this.options.channel.bind('sort', this.resort, this);

        Cloudwalkers.Session.bind ('message:add', function () { self.options.channel.reset (); self.options.channel.fetch (); }, this)

		// Fetch!
		this.options.channel.fetch ({
			'error' : function (e)
			{
				//alert ('Error');
				console.log (e);
			},
			'success' : function (e)
			{
				self.filterview.render ();

				self.$el.find ('.messages-container p.no-current-messages').remove ();

				//self.$el.find ('.comment-box').html ('');
				//self.addAll ();
				self.$el.find ('.loading').hide ();

				if (self.canLoadMore)
					self.$el.find ('.load-more').show ();

				if (self.options.channel.length == 0)
					self.$el.find ('.messages-container').html ('<p class="no-current-messages">Currently there are no messages.</p>');
			}
		});

		// Add filer
		this.filterview = new Cloudwalkers.Views.Filter ({ 'collection' : this.options.channel });

		if (this.options.channel.canHaveFilters)
		{
			this.$el.prepend (this.filterview.render ().el);
		}

		// Auth refresh
		this.interval = setInterval (function ()
		{
			//self.options.channel.reset (); 
			//self.options.channel.fetch ();
			self.options.channel.update ();
		}, 1000 * 30);

		return this;
	},

	'destroy' : function ()
	{
		clearInterval (this.interval);
	},

	'getMessageView' : function (message)
	{
		var messageView;
		if (message.get ('type') == 'OUTGOING')
		{
			messageView = new Cloudwalkers.Views.OutgoingMessage ({ 'model' : message });
		}
		else
		{
			messageView = new Cloudwalkers.Views.Message ({ 'model' : message });
		}
		return messageView;
	},

	'addOne' : function (message)
	{
		/*
		var index = message.collection.indexOf (message);

		var messageView = this.getMessageView (message);
		var element = messageView.render ().el;

		$(element).attr ('data-message-id', message.get ('id'));

		if (index === 0)
		{
			//console.log ('test');
			this.$el.find ('.messages-container').prepend (element);
		}

		else
		{
			var previousmessage = message.collection.at (index - 1);

			if (previousmessage)
			{
				// Can we find the previous message?
				var previousdiv = this.$el.find ('.messages-container .message-view[data-message-id=' + previousmessage.get ('id') + ']');

				if (previousdiv.length > 0)
				{
					previousdiv.after (element);
				}
				else
				{
					this.$el.find ('.messages-container').append (element);			
				}
			}
			else
			{
				this.$el.find ('.messages-container').append (element);
			}
		}
		*/

		this.trigger ('content:change')
	},

	'resort' : function ()
	{
		var self = this;

		self.$el.find ('.messages-container p.no-current-messages').remove ();

		// Go trough all messages
		this.options.channel.each (function (message)
		{
			// Is already in the list?
			var current = self.$el.find ('.messages-container .message-view[data-message-id=' + message.get ('id') + ']');

			if (current.length > 0)
			{
				return;
			}

			var index = message.collection.indexOf (message);

			var messageView = self.getMessageView (message);
			var element = messageView.render ().el;

			$(element).attr ('data-message-id', message.get ('id'));

			if (index == 0)
			{
				self.$el.find ('.messages-container').prepend (element);
			}
			else
			{
				var previousmessage = message.collection.at (index - 1);

				// Check if previous message is found
				var previouselement = self.$el.find ('.messages-container .message-view[data-message-id=' + previousmessage.get ('id') + ']');

				if (previouselement.length > 0)
				{
					previouselement.after (element);
				}

				else
				{
					console.log ('PREVIOUS MESSAGE NOT FOUND');
				}
			}
		});
	},

	'refresh' : function ()
	{
		this.$el.find ('.messages-container').html ('');
		this.options.channel.each (this.addOne, this);

		if (this.options.channel.length == 0)
		{
			this.$el.find ('.messages-container').html ('<p class="no-current-messages">Currently there are no messages.</p>');
		}
	}

});