/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.Widget = Backbone.View.extend({

	'title' : 'Untitled widget',
	'icon' : 'inbox',
	'color' : 'blue',
	'network' : null,

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

		if (typeof (this.options.icon) != 'undefined' && this.options.icon)
			this.icon = this.options.icon;

		this.$el.html 
		(
			Mustache.render 
			(
				Templates.widget, 
				{ 
					'title' : this.title, 
					'color' : this.color, 
					'icon' : this.icon,
					'tools' : this.tools,
					'network' : this.network
				}
			)
		);

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
		this.$el.find ('.' + tool['class']).click (function (ev)
		{
			self[tool.event] (ev);
		});
	}

});