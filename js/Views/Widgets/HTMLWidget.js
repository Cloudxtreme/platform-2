/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.HTMLWidget = Backbone.View.extend({

	'title' : 'Untitled widget',
	'color' : 'blue',

	'innerRender' : function (element)
	{
		element.html (this.options.html);
	},

	'render' : function ()
	{
		this.innerRender (this.$el);
		return this;
	}

});