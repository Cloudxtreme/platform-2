Cloudwalkers.Views.MessageContainer = Backbone.View.extend({

	'events' : {
		'click .load-more a' : 'loadMore'
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

		// Fetch!
		this.options.channel.fetch ({
			'error' : function (e)
			{
				alert ('Error');
				console.log (e);
			},
			'success' : function (e)
			{
				//self.$el.find ('.comment-box').html ('');
				//self.addAll ();
				self.$el.find ('.loading').hide ();
				self.$el.find ('.load-more').show ();
			}
		});

		return this;
	},

	'addOne' : function (message)
	{
		var index = message.collection.indexOf (message);

		var messageView;

		if (message.get ('type') == 'OUTGOING')
		{
			messageView = new Cloudwalkers.Views.OutgoingMessage ({ 'model' : message });
		}
		else
		{
			messageView = new Cloudwalkers.Views.Message ({ 'model' : message });
		}

		var element = messageView.render ().el;

		if (index === 0)
		{
			//console.log ('test');
			this.$el.find ('.messages-container').prepend (element);
		}

		else
		{
			this.$el.find ('.messages-container .message-view').eq (index - 1).after (element);
		}

		jcf.customForms.replaceAll();
	},

	'refresh' : function ()
	{
		this.$el.find ('.messages-container').html ('');
		this.options.channel.each (this.addOne, this);
	}

});