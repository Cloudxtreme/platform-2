Cloudwalkers.Views.Loading = Backbone.View.extend({

	'render' : function ()
	{
		var data = {};

		$(this.el).html (Mustache.render (Templates.loading, data));

		return this;
	}

});