/**
* Any widget that contains messages should extend this.
*/
Cloudwalkers.Views.Widgets.MessageContainer = Cloudwalkers.Views.Widgets.Widget.extend ({

	'template' : 'messagecontainer',
	'messageelement' : 'tr',

	'canLoadMore' : true,

	'events' : {
		'click .portlet-title.line' : 'collapse',
		'click .load-more a' : 'loadMore'
	},

	'initialize' : function ()
	{
		var self = this;

		this.title = this.options.channel.name;
		this.canLoadMore = typeof (this.options.channel.canLoadMore) == 'undefined' ? true : this.options.channel.canLoadMore;

		this.on ('destroy', function ()
		{
			self.destroy ();
		});

        // Always add this to all your widget initializations
        this.initializeWidget ();
	},

	'refreshWidget' : function (e)
	{
		e.preventDefault ();

		//console.log (e);

        //var el = jQuery(e.currentTarget).parents(".portlet");
        //App.blockUI(el);

		this.options.channel.update ({
			'success' : function ()
			{
				//App.unblockUI(el);
			}
		});
	},

	'innerRender' : function (element)
	{
		//element.html ('<p>Please wait, loading messages.</p>');
		var self = this;
		var data = {};

		jQuery.extend (true, data, this.options);

		data.showMoreButton = typeof (this.options.channel.showMoreButton) != 'undefined' ? this.options.channel.showMoreButton : false;

		element.html (Mustache.render (Templates[this.template], data));

		element.find ('.load-more').hide ();
		element.find ('.timeline-loading').show ();

        this.options.channel.bind('add', this.addOne, this);
        this.options.channel.bind('refresh', this.refresh, this);
        this.options.channel.bind('reset', this.refresh, this);
        this.options.channel.bind('sort', this.resort, this);
        //this.options.channel.bind('change', this.resort, this);
        this.options.channel.bind('remove', this.removeMessage, this);

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
				//console.log (e);
			},
			'success' : function (e)
			{
				//console.log (self.options.channel.length);
				
				//element.find ('p.no-current-messages').remove ();

				//self.$innerEl.find ('.comment-box').html ('');
				//self.addAll ();
				//element.find ('.loading').hide ();

				if (self.canLoadMore
                    && (typeof (self.options.channel.loadMore) != 'undefined')
                )
				{
                    if (self.options.channel.length > 0)
                    {
					    element.find ('.load-more').show ();
                    }

					element.find ('.timeline-loading').hide();
				}

				// Change laoding class
				element.find('.inner-loading').toggleClass((self.options.channel.length)? 'inner-loading': 'inner-empty inner-loading');
					
					//element.find ('.messages-container').html ('<p class="no-current-messages">Currently there are no messages.</p>');

				self.afterInit ();
			}
		});

		// Auth refresh
		this.interval = setInterval (function ()
		{
			//self.options.channel.reset (); 
			//self.options.channel.fetch ();
			self.options.channel.update ();
		}, 1000 * 15);

		return this;
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

		element.find ('.timeline-loading').show ();
		this.$el.find ('.load-more').hide ();
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
		messageView = new Cloudwalkers.Views.Message (parameters);
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

	'afterInit' : function ()
	{

	},

	'resort' : function ()
	{
		//console.log ('--- RESORTING ---');

		var self = this;

		self.$el.find ('p.no-current-messages').remove ();

		// Go trough all messages
		this.options.channel.each (function (message)
		{
			// Is already in the list?
			var current = self.$el.find ('.messages-container .message-view[data-message-id=' + message.get ('id') + ']');
			var element;

			var index = message.collection.indexOf (message);

			if (current.length > 0)
			{
				element = current;
			}
			else
			{

				var messageView = self.getMessageView (message);
				element = messageView.render ().el;

				$(element).attr ('data-message-id', message.get ('id'));

				if (index == 0)
				{
					self.onFirstAdd (message, messageView);
				}
			}

			//console.log (index + ', ' + message.get ('body').plaintext);

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

		setTimeout (function ()
		{
			self.trigger ('content:change');
		}, 1);
	},

	'removeMessage' : function (message)
	{
		this.$el.find ('.messages-container .message-view[data-message-id=' + message.get ('id') + ']').remove ();
	},

	'refresh' : function ()
	{
		//this.$el.find ('.messages-container').html ('');
		//this.resort ();
		//this.options.channel.each (this.addOne, this);

		/*
		if (this.options.channel.length == 0)
		{
			this.$innerEl.find ('.messages-container').html ('<p class="no-current-messages">Currently there are no messages.</p>');
		}
		*/
	}

});