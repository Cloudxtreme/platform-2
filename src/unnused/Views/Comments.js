define(
	['backbone', 'Views/Comment'],
	function (Backbone, CommentView)
	{
		var Comments = Backbone.View.extend({

			'events' : {
				'click .load-more-comments a' : 'loadMore'
			},

			'render' : function ()
			{
				
				var self = this;
				var parent = this.options.parent;

				var data = {};

				var stream = self.options.parent.getStream ();
				data.textfields = stream.get ('textfields');

				$(this.el).html (Mustache.render (Templates.comments, data));
				

				//$(this.el).find ('.comments').html ('<p>Please wait, we are loading the comments.</p>');

				self.$el.find ('.loading-comments').show ();
				self.$el.find ('.load-more-comments').hide ();
				self.$el.find ('.comments-inner-container').hide ();
				self.$el.find ('.no-comments').hide ();

				//var collection = new Cloudwalkers.Collections.Comments ({ 'id' : this.options.parent.get ('id') });
				this.collection = collection;

				this.options.parent.on ('change', function ()
				{
					//self.collection.reset ();
					self.collection.fetch ();
				});

				collection.fetch ({
					'success' : function( )
					{
						
						self.$el.find ('.comments-inner-container').show ();
						self.$el.find ('.loading-comments').hide ();

						if (self.collection.length % 10 === 0)
						{
							self.$el.find ('.load-more-comments').show ();
						}

						if (self.collection.length === 0)
						{
							self.$el.find ('.load-more-comments').hide ();
							self.$el.find ('.no-comments').show ();
							self.$el.find ('.comments-inner-container').hide ();
						}
					}
				});

		        collection.bind('add', this.addOne, this);
		        collection.bind('refresh', this.refresh, this);
		        collection.bind('reset', this.refresh, this);
		        collection.bind('remove', this.removeMessage, this);
				
				return this;
			},

			'addOne' : function (message)
			{
				var index = message.collection.indexOf (message);

				var selected = false;
				if (this.options.selectedchild)
				{
					selected = this.options.selectedchild.get ('id') == message.get ('id');	
				}

				var messageView = new CommentView ({ 'model' : message, 'selected' : selected });

				var element = messageView.render ().el;

				$(element).attr ('data-message-id', message.get ('id'));

				if (index === 0)
				{
					this.$el.find ('.comments-inner-container').prepend (element);
				}

				else if (this.$el.find ('.comments-inner-container .comments-row').eq (index - 1).length > 0)
				{
					this.$el.find ('.comments-inner-container .comments-row').eq (index - 1).after (element);
				}

		        else
		        {
		            this.$el.find ('.comments-inner-container').append (element);
		        }
			},

			'refresh' : function ()
			{
				this.$el.find ('.messages-container').html ('');
				this.options.channel.each (this.addOne, this);

				if (this.options.channel.length === 0)
				{
					var stream = this.options.parent.getStream ();
					this.$el.find ('.comments-inner-container').html ('<p>' + stream.get ('textfields').nochildren + '</p>');
				}
			},

			'removeMessage' : function (message)
			{
				this.$el.find ('.comments-inner-container [data-message-id=' + message.get ('id') + ']').remove ();
			},

			'loadMore' : function ()
			{
				var self = this;

				// Hide the load button
				this.collection.loadMore ({
					'success' : function ()
					{
						self.$el.find ('.loading-comments').hide ();
						//self.$el.find ('.load-more-comments').show ();

						if (self.collection.length % 10 === 0 && self.collection.length > 0)
						{
							self.$el.find ('.load-more-comments').show ();
						}
					}
				});

				this.$el.find ('.loading-comments').show ();
				this.$el.find ('.load-more-comments').hide ();
			}

		});

		return Comments;
});