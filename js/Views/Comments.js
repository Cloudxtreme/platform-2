Cloudwalkers.Views.Comments = Backbone.View.extend({

	'render' : function ()
	{
		var parent = this.options.parent;

		var data = {};
		$(this.el).html (Mustache.render (Templates.comments, data));


		$(this.el).find ('.comments').html ('<p>Please wait, we are loading the comments.</p>');

		var collection = new Cloudwalkers.Collections.Comments ({ 'id' : this.options.parent.get ('id') });
		collection.fetch ();

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
			this.$el.find ('.comments').prepend (element);
		}

		else
		{
			this.$el.find ('.comments .comment-row').eq (index - 1).after (element);
		}

		jcf.customForms.replaceAll();
	},

	'refresh' : function ()
	{
		this.$el.find ('.messages-container').html ('');
		this.options.channel.each (this.addOne, this);

		if (this.options.channel.length == 0)
		{
			this.$el.find ('.comments').html ('<p>Currently there are no comments.</p>');
		}
	}

});