/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.DetailedList = Cloudwalkers.Views.Widgets.MessageContainer.extend({

	'template' : 'detailedlist',
	'messagetemplate' : 'messagedetailedlist',
	'messageelement' : 'tr',
	'id' : 'inbox',

	'render' : function ()
	{
		this.$innerEl = this.$el;
		this.innerRender (this.$innerEl);

		this.$el.attr ('id', 'list');

		return this;
	},

	'processMessageView' : function (message, view)
	{
		var self = this;
		view.$el.click (function ()
		{
			self.$el.find ('td').removeClass ('active');
			view.$el.find ('td').addClass ('active');
			self.trigger ('select:message', message);
		});
	},

	'onFirstAdd' : function (message, messageView)
	{
		setTimeout (function ()
		{
			messageView.$el.click ();
		}, 100);
	}

});