/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.DetailedView = Cloudwalkers.Views.Widgets.Widget.extend({

	'initialize' : function ()
	{
		var self = this;
		this.options.list.on ('select:message', function (message) { self.selectMessage (message); });
	},

	'selectMessage' : function (message)
	{
		var messageView;

		var parameters = {
			'model' : message,
			'template' : 'messagedetailview',
			'tagName' : 'div'
		};

		messageView = new Cloudwalkers.Views.OutgoingMessage (parameters);

		this.$el.html (messageView.render ().el);
	},

	'render' : function ()
	{
		this.$el.html ('');
		return this;
	}

});