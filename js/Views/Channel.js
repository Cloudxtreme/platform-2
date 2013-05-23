Cloudwalkers.Views.Channel = Backbone.View.extend({

	'render' : function ()
	{
		var data = {};

		data.title = 'Inbox';

		$(this.el).html (Mustache.render (Templates.messagecontainer, data));

		this.options.channel.fetch ({
			'error' : function (e)
			{
				alert ('Error');
				console.log (e);
			},
			'success' : function (e)
			{
				console.log (e);
			}
		});

		return this;
	}

});