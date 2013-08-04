/**
* Any widget that contains messages should extend this.
*/
Cloudwalkers.Views.Widgets.MessageContainer = Cloudwalkers.Views.Widgets.Widget.extend ({

	'template' : 'messagecontainer',
	'messageelement' : 'tr',

	'canLoadMore' : true,

	'initialize' : function ()
	{
		this.title = this.options.channel.name;
	},

	'events' : {
		'click .load-more a' : 'loadMore'
	},

	'innerRender' : function (element)
	{
		//element.html ('<p>Please wait, loading messages.</p>');
		var self = this;
		var data = {};

		data.showMoreButton = typeof (this.options.channel.showMoreButton) != 'undefined' ? this.options.channel.showMoreButton : false;

		element.html (Mustache.render (Templates[this.template], data));

		this.$innerEl.find ('.load-more').hide ();
		this.$innerEl.find ('.loading').show ();

        this.options.channel.bind('add', this.addOne, this);
        this.options.channel.bind('refresh', this.refresh, this);
        this.options.channel.bind('reset', this.refresh, this);
        this.options.channel.bind('sort', this.resort, this);

        Cloudwalkers.Session.bind 
        (
        	'message:add', 
        	function () 
        	{ 
        		self.options.channel.reset (); 
        		self.options.channel.fetch (); 
        	}, 
        	this
        );

		// Fetch!
		this.options.channel.fetch ({
			'error' : function (e)
			{
				//alert ('Error');
				console.log (e);
			},
			'success' : function (e)
			{
				element.find ('p.no-current-messages').remove ();

				//self.$innerEl.find ('.comment-box').html ('');
				//self.addAll ();
				element.find ('.loading').hide ();

				if (self.canLoadMore && (typeof (self.options.channel.loadMore) != 'undefined'))
					element.find ('.load-more').show ();

				console.log (self.options.channel.length);

				if (self.options.channel.length == 0)
					element.find ('.messages-container').html ('<p class="no-current-messages">Currently there are no messages.</p>');
			}
		});

		// Auth refresh
		/*
		this.interval = setInterval (function ()
		{
			//self.options.channel.reset (); 
			//self.options.channel.fetch ();
			self.options.channel.update ();
		}, 1000 * 30);
		*/

		return this;
	},

	'loadMore' : function ()
	{
		var self = this;

		// Hide the load button
		this.options.channel.loadMore ({
			'success' : function ()
			{
				self.$innerEl.find ('.loading').hide ();
				self.$innerEl.find ('.load-more').show ();
			}
		});

		this.$innerEl.find ('.loading').show ();
		this.$innerEl.find ('.load-more').hide ();
	},

	'destroy' : function ()
	{
		clearInterval (this.interval);
	},

	// Just a small function to overwrite
	'processMessageView' : function (message)
	{

	},

	'getMessageView' : function (message)
	{
		var messageView;

		var parameters = {
			'model' : message,
			'template' : this.messagetemplate,
			'tagName' : this.messageelement
		};

		//console.log (parameters);

		if (message.get ('type') == 'OUTGOING')
		{
			messageView = new Cloudwalkers.Views.OutgoingMessage (parameters);
		}
		else
		{
			messageView = new Cloudwalkers.Views.Message (parameters);
		}

		this.processMessageView (message, messageView);

		return messageView;
	},

	'onFirstAddEvent' : function (message, messageView)
	{
		var self = this;
		setTimeout (function ()
		{
			self.onFirstAdd (message, messageView);
		}, 1);
	},

	'onFirstAdd' : function (message, messageView)
	{

	},

	'resort' : function ()
	{
		var self = this;

		self.$innerEl.find ('p.no-current-messages').remove ();

		// Go trough all messages
		this.options.channel.each (function (message)
		{
			// Is already in the list?
			var current = self.$innerEl.find ('.messages-container .message-view[data-message-id=' + message.get ('id') + ']');

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
				self.$innerEl.find ('.messages-container').prepend (element);
				self.onFirstAdd (message, messageView);
			}
			else
			{
				var previousmessage = message.collection.at (index - 1);

				// Check if previous message is found
				var previouselement = self.$innerEl.find ('.messages-container .message-view[data-message-id=' + previousmessage.get ('id') + ']');

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
		this.$innerEl.find ('.messages-container').html ('');
		this.resort ();
		//this.options.channel.each (this.addOne, this);

		/*
		if (this.options.channel.length == 0)
		{
			this.$innerEl.find ('.messages-container').html ('<p class="no-current-messages">Currently there are no messages.</p>');
		}
		*/
	}

});