/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.Widget = Backbone.View.extend({

	'title' : 'Untitled widget',
	'color' : 'blue',

	'tools' : [],

	'innerRender' : function (element)
	{
		element.html ('No inner content set.');
	},

	'render' : function ()
	{
		var self = this;

		if (typeof (this.options.title) != 'undefined')
			this.title = this.options.title;

		if (typeof (this.options.color) != 'undefined')
			this.color = this.options.color;

		this.$el.html (Mustache.render (Templates.widget, { 'title' : this.title, 'color' : this.color, 'tools' : this.tools }));

		// Events
		for (var i = 0; i < this.tools.length; i ++)
		{
			self.attachToolEvents (this.tools[i]);
		}

		this.$innerEl = $(this.$el.find ('.portlet-body'));
		this.innerRender (this.$innerEl);

		return this;
	},

	'attachToolEvents' : function (tool)
	{
		var self = this;
		this.$el.find ('.' + tool.class).click (function (ev)
		{
			self[tool.event] (ev);
		});
	}

});