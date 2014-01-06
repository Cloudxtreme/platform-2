Cloudwalkers.Views.Inbox = Cloudwalkers.Views.Pageview.extend({

	'title' : 'Inbox',
	'className' : "container-fluid inbox",
	
	'render' : function()
	{

		this.$el.html (Mustache.render (Templates.pageview, {'title' : this.options.type}));
		this.$container = this.$el.find("#widgetcontainer").eq(0);
		
		
		
		// Add list widget
		var list = new Cloudwalkers.Views.Widgets.InboxList(this.options);
		this.appendWidget(list, 4);
		
		this.appendhtml(Templates.inboxcontainer);
		
		return this;
	}
	
});