Cloudwalkers.Views.Dashboard = Backbone.View.extend({

	'render' : function ()
	{
		var data = {};

		data.title = 'Inbox';

		$(this.el).html (Mustache.render (Templates.dashboard, data));

		return this;
	}

});