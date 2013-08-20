/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.DetailedView = Cloudwalkers.Views.Widgets.Widget.extend({

	'id' : 'inbox',

	'initialize' : function ()
	{
		var self = this;
		this.options.list.on ('select:message', function (message) { self.selectMessage (message); });
	},

	'selectMessage' : function (message)
	{
		//console.log ('selecting message');
		//console.log (message);

		var messageView;

		var parameters = {
			'model' : message,
			'template' : 'messagedetailview',
			'childtemplate' : 'messagedetailviewchild',
			'originaltemplate' : 'messagedetailoriginal',
			'tagName' : 'div',
			'showcomments' : true
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