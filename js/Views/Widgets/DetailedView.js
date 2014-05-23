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
		var messageView;

		// ALWAYS show the parent message
		var parent = message.get ('parentmodel');
		var selectedcomment = null;

		if (parent)
		{
			selectedcomment = message;
			message = parent;
		}

		var parameters = {
			'model' : message,
			'selectedchild' : selectedcomment,
			'template' : 'messagedetailview',
			'childtemplate' : 'messagedetailviewchild',
			'originaltemplate' : 'messagedetailoriginal',
			'tagName' : 'div',
			'showcomments' : true
		};

		messageView = new Cloudwalkers.Views.Message (parameters);

		this.$el.html (messageView.render ().el);
		
		this.setHeight(messageView.$el);
		
	},
	
	'render' : function ()
	{
		this.$el.html ('');
		
		return this;
	},
	
	'setHeight' : function($el) {
		
		$el.css("height", $("#inboxcontainer").height() - 16 + "px");	
	}

});