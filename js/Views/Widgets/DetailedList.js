/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.DetailedList = Cloudwalkers.Views.Widgets.MessageContainer.extend({

	'template' : 'detailedlist',
	'messagetemplate' : 'messagedetailedlist',
	'messageelement' : 'tr',
	'id' : 'inbox',

	'currentSelected' : null,

	'render' : function ()
	{
		var self = this;

		this.$innerEl = this.$el;
		this.innerRender (this.$innerEl);

		this.$el.attr ('id', 'list');

		this.on ('content:change', function ()
		{
			if (self.currentSelected)
			{
				self.currentSelected.$el.find ('td').addClass ('active');
			}
		});

		return this;
	},

	'processMessageView' : function (message, view)
	{
		var self = this;
		view.$el.click (function ()
		{
			self.$el.find ('td').removeClass ('active');

			self.currentSelected = view;

			self.currentSelected.$el.find ('td').addClass ('active');
			self.trigger ('select:message', message);
		});
	},

	'onFirstAdd' : function (message, messageView)
	{
		if (!this.options.selectmessage)
		{
			setTimeout (function ()
			{
				messageView.$el.click ();
			}, 100);
		}
	},

	'afterInit' : function ()
	{
		if (this.options.selectmessage)
		{
			//alert (this.options.selectmessage);
			this.$el.find ('.messages-container').find ('[data-message-id=' + this.options.selectmessage + ']').click ();
		}
	}

});