Cloudwalkers.Views.Widgets.EmptyData = Backbone.View.extend({
	
	'title' : "EmptyData",

	'initialize' : function(options)
	{
		$.extend(this, options);
	},

	'render' : function ()
	{			
		this.$el.html (Mustache.render (Templates.emptydata, {message: this.message}));
		return this;
	}
});