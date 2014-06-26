

Cloudwalkers.Views.Demo = Cloudwalkers.Views.Pageview.extend({

	'title' : 'Demo',
	
	'initialize' : function (options)
	{

		if(options) $.extend(this, options);

	},
	
	'render' : function()
	{
		// Build Pageview
		this.$el.html (Mustache.render (Templates.pageview, {title: this.title}));
		this.$container = this.$el.find("#widgetcontainer").eq(0);
		
		// Append Editor
		this.editor = new Cloudwalkers.Views.Editor({content: null, parent: this});
		this.appendWidget(this.editor, 4);

		// Listen to editor triggers
		//this.listenTo(this.editor, "imageadded", this.addimage);
		//this.listenTo(this.editor, "contentadded", this.monitor);

		Cloudwalkers.RootView.viewContact();
		
		return this;
	}	
});


/*
Cloudwalkers.Views.Demo = Cloudwalkers.Views.Pageview.extend({

	'title' : 'Demo',
	
	'initialize' : function (options)
	{

		if(options) $.extend(this, options);

	},
	
	'render' : function()
	{

		// Build Pageview
		this.$el.html (Mustache.render (Templates.pageview, {'title' : this.title}));
		
		// Widgets parent
		this.$container = this.$el.find("#widgetcontainer").eq(0);
		
		this.appendhtml("<h3>Demo</h3>");
		
		return this;
	}	
});
*/

/*
// RUI Demo:
Cloudwalkers.Views.Demo = Cloudwalkers.Views.Pageview.extend({

	'title' : 'Inbox',
	'className' : "container-fluid inbox",
	
	'initialize' : function (options)
	{

		if(options) $.extend(this, options);

		// Memory cloth
		var settings = Cloudwalkers.Session.viewsettings(this.options.type);
		
		if (settings.streams)
			this.options.filters = {contacts : {string:"", list:[]}, streams : settings.streams};
	},
	
	'render' : function()
	{

		// Create pageview
		this.$el.html (Mustache.render (Templates.pageview, {'title' : this.options.type}));
		this.$container = this.$el.find("#widgetcontainer").eq(0);
		
		// Dedect childtype
		this.options.channel.childtype = this.options.type.slice(0, -1);
		
		// Add list widget
		var list = new Cloudwalkers.Views.Widgets.InboxDemoList(this.options);
		
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
	}
	
});
*/