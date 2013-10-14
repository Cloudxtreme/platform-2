Cloudwalkers.Views.Settings.Account = Backbone.View.extend({

	'events' : {

	},

	'render' : function ()
	{
		var self = this;

		var data = {};
		self.$el.html (Mustache.render (Templates.settings.account, data));

		return this;
	}
});