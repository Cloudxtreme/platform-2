/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.Widget = Backbone.View.extend({

	'title' : 'Untitled widget',
	'color' : 'blue',

	'innerRender' : function (element)
	{
		element.html ('No inner content set.');
	},

	'render' : function ()
	{
		if (typeof (this.options.title) != 'undefined')
			this.title = this.options.title;

		if (typeof (this.options.color) != 'undefined')
			this.color = this.options.color;

		this.$el.html (Mustache.render (Templates.widget, { 'title' : this.title, 'color' : this.color }));

		this.$innerEl = $(this.$el.find ('.portlet-body'));
		this.innerRender (this.$innerEl);

		return this;
	}

});