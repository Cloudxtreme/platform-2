/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.Timeline = Cloudwalkers.Views.Widgets.MessageContainer.extend({

	'template' : 'timeline',
	'messagetemplate' : 'messagetimeline',
	'messageelement' : 'li',

	'render' : function ()
	{
		if (typeof (this.options.title) != 'undefined')
			this.title = this.options.title;

		if (typeof (this.options.color) != 'undefined')
			this.color = this.options.color;

		this.$el.html (Mustache.render (Templates.widgetnoborder, { 'title' : this.title, 'color' : this.color }));

		this.$innerEl = $(this.$el.find ('.portlet-body'));
		this.innerRender (this.$innerEl);

		return this;
	}

});