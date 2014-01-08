Cloudwalkers.Views.Inbox = Cloudwalkers.Views.Pageview.extend({

	'title' : 'Inbox',
	'className' : "container-fluid inbox",
	
	'render' : function()
	{

		this.$el.html (Mustache.render (Templates.pageview, {'title' : this.options.type}));
		this.$container = this.$el.find("#widgetcontainer").eq(0);
		
		// Dedect childtype
		this.options.channel.childtype = this.options.type.slice(0, -1);
		
		// Add list widget
		var list = this.options.channel.childtype == "message"?
		
			new Cloudwalkers.Views.Widgets.InboxMessageList(this.options):
			new Cloudwalkers.Views.Widgets.InboxNotificationList(this.options);
		
		this.appendWidget(list, 4);
		this.appendhtml(Templates.inboxcontainer);
		
		return this;
	}
	
});