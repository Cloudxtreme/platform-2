Cloudwalkers.Views.User = Backbone.View.extend({

	'render' : function ()
	{
		var self = this;
		var data = {};

		data.user = this.model.attributes;

		self.$el.html (Mustache.render (Templates.user, data));

		return this;
	}
});