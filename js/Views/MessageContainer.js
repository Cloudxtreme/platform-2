Cloudwalkers.Views.MessageContainer = Backbone.View.extend({

	'render' : function ()
	{
		var data = {};

		data.title = 'Inbox';

		$(this.el).html (Mustache.render (Templates.messagecontainer, data));

		return this;
	}

});