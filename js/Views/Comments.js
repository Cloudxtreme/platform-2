Cloudwalkers.Views.Comments = Backbone.View.extend({

	'events' : {
		'click .load-more-comments a' : 'loadMore'
	},

	'render' : function ()
	{
		var self = this;
		var parent = this.options.parent;

		var data = {};
		$(this.el).html (Mustache.render (Templates.comments, data));


		//$(this.el).find ('.comments').html ('<p>Please wait, we are loading the comments.</p>');

		self.$el.find ('.loading-comments').show ();
		self.$el.find ('.load-more-comments').hide ();
		self.$el.find ('.comments-inner-container').hide ();

		var collection = new Cloudwalkers.Collections.Comments ({ 'id' : this.options.parent.get ('id') });
		this.collection = collection;

		collection.fetch ({
			'success' : function( )
			{
				self.$el.find ('.comments-inner-container').show ();
				self.$el.find ('.loading-comments').hide ();
				self.$el.find ('.load-more-comments').show ();

				if (self.collection.length == 0)
				{
					self.$el.find ('.comments-inner-container').html ('<p>No comments available right now.</p>');
				}
			}
		});

        collection.bind('add', this.addOne, this);
        collection.bind('refresh', this.refresh, this);
        collection.bind('reset', this.refresh, this);
		
		return this;
	},

	'addOne' : function (message)
	{
		var index = message.collection.indexOf (message);

		var messageView = new Cloudwalkers.Views.Comment ({ 'model' : message });

		var element = messageView.render ().el;

		if (index === 0)
		{
			//console.log ('test');
			this.$el.find ('.comments-inner-container').prepend (element);
		}

		else
		{
			this.$el.find ('.comments-inner-container .comments-row').eq (index - 1).after (element);
		}
	},

	'refresh' : function ()
	{
		this.$el.find ('.messages-container').html ('');
		this.options.channel.each (this.addOne, this);

		if (this.options.channel.length == 0)
		{
			this.$el.find ('.comments-inner-container').html ('<p>Currently there are no comments.</p>');
		}
	},

	'loadMore' : function ()
	{
		var self = this;

		// Hide the load button
		this.collection.loadMore ({
			'success' : function ()
			{
				self.$el.find ('.loading-comments').hide ();
				self.$el.find ('.load-more-comments').show ();
			}
		});

		this.$el.find ('.loading-comments').show ();
		this.$el.find ('.load-more-comments').hide ();
	}

});