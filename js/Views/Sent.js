Cloudwalkers.Views.Sent = Cloudwalkers.Views.Pageview.extend({
	
	'title' : 'Sent',
	'className' : "container-fluid inbox",
			
	'initialize' : function(options)
	{
		this.model = Cloudwalkers.Session.getStream("sent");
		
		this.translateTitle("sent");

		// Memory cloth
		var settings = Cloudwalkers.Session.viewsettings('sent');
		
		if (settings.streams)
			this.options.filters = {contacts : {string:"", list:[]}, streams : settings.streams};
	},

	'render' : function()
	{	
		// Create pageview
		this.$el.html (Mustache.render (Templates.pageview, {'title' : this.title}));
		this.$container = this.$el.find("#widgetcontainer").eq(0);
		
		this.options.model = this.model;
		// Dedect childtype
		//this.options.channel.childtype = this.options.type.slice(0, -1);

		// Add list widget
		var list = new Cloudwalkers.Views.Widgets.SentMessageList(this.options);
		
		this.appendWidget(list, 4);
		this.appendhtml(Templates.inboxcontainer);
		
		// Pageview listeners
		//this.listenTo(Cloudwalkers.RootView, "resize", this.resize);

		
		return this;
	},

	'resize' : function(height)
	{
		this.$el.find("#widgetcontainer").height(height -140);
	},
	
	'finish' : function()
	{
		
		this.resize(Cloudwalkers.RootView.height());
		
		// Add scroller for message
		$message = this.$el.find(".inbox-container").wrap("<div class='scroller'>");
		
		$message.parent().slimScroll({height: "inherit"});
	},

	'translateTitle' : function(translatedata)
	{	
		// Translate Title
		this.title = Cloudwalkers.Session.polyglot.t(translatedata);
	}
});