Cloudwalkers.Views.IB = Cloudwalkers.Views.Pageview.extend({
	
	'id' : 'inbox',
	'title' : 'Inbox',
	'className' : "container-fluid inbox",
	
	'initialize' : function ()
	{
		if(options) $.extend(this, options);
		
		// Parameters
		this.model = Cloudwalkers.Session.getStream("draft");
		if(!this.model) return Cloudwalkers.Router.Instance.exception();
		
		// Memory cloth
		var settings = Cloudwalkers.Session.viewsettings("ib-" + this.channeltype);
		
		// Pageview listeners
		this.listenTo(Cloudwalkers.RootView, "resize", this.resize);
		
	},
	
	'render' : function()
	{

		// Create pageview
		this.$el.html (Mustache.render (Templates.pageview, {'title' : this.title}));
		this.$container = this.$el.find("#widgetcontainer").eq(0);
		
		// Dedect childtype
		this.options.channel.childtype = this.options.type.slice(0, -1);
		
		// Add list widget
		var list = new Cloudwalkers.Views.Widgets.InboxList({model: this.model});
		
		this.appendWidget(list, 4);
		this.appendhtml(Templates.inboxcontainer);
		
		// Pageview listeners
		this.listenTo(Cloudwalkers.RootView, "resize", this.resize);

		
		return this;
	},
	
	/*'initialize' : function (options)
	{
		if(options) $.extend(this, options);
		
		// Parameters
		this.model = Cloudwalkers.Session.getStream("draft");
		if(!this.model) return Cloudwalkers.Router.Instance.exception();
		
		// Memory cloth
		var settings = Cloudwalkers.Session.viewsettings("ib-" + this.channeltype);
		
		// Pageview listeners
		this.listenTo(Cloudwalkers.RootView, "resize", this.resize);
		
		//if (settings.streams)
		//	this.options.filters = {contacts : {string:"", list:[]}, streams : settings.streams};
	},
	
	'render' : function()
	{
		// Create pageview
		this.$el.html (Mustache.render (Templates.inbox, {'title' : this.title}));
		this.$container = this.$el.find("section").eq(0);
		
		// Add widgets
		var filter = new Cloudwalkers.Views.Widgets.InboxFilter({model: this.model, filter: this.filter});
		var list = new Cloudwalkers.Views.Widgets.InboxList({model: this.model});
		
		this.appendWidget(list, 12);
		list.$el.find("div.filter").append(filter);
		
		return this;
	},*/
	
	'resize' : function(height)
	{
		this.$el.find("section, main").height(height -120);
	},
	
	'finish' : function()
	{
		
		this.resize(Cloudwalkers.RootView.height());
		
		// Add scroller for message
		$message = this.$el.find(".inbox-container").wrap("<div class='scroller'>");
		
		$message.parent().slimScroll({height: "inherit"});
	}
	
});


Cloudwalkers.Views.Inbox = Cloudwalkers.Views.Pageview.extend({

	'title' : 'Inbox',
	'className' : "container-fluid inbox",
	
	'initialize' : function ()
	{
		// Memory cloth
		var settings = Cloudwalkers.Session.viewsettings(this.options.type);
		
		if (settings.streams)
			this.options.filters = {contacts : {string:"", list:[]}, streams : settings.streams};
	},
	
	'render' : function()
	{

		// Translated Title
		this.translate_title = this.translateString(this.options.type);

		// Create pageview

		this.$el.html (Mustache.render (Templates.pageview, {'title' : this.translate_title}));
		this.$container = this.$el.find("#widgetcontainer").eq(0);
		
		// Dedect childtype
		this.options.channel.childtype = this.options.type.slice(0, -1);
		
		// Add list widget
		var list = this.options.type == "messages"?
			
			new Cloudwalkers.Views.Widgets.InboxMessageList(this.options):
			new Cloudwalkers.Views.Widgets.InboxNotificationList(this.options);
		
		this.appendWidget(list, 4);
		this.appendhtml(Templates.inboxcontainer);
		
		// Pageview listeners
		this.listenTo(Cloudwalkers.RootView, "resize", this.resize);

		
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

	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	}
	
});