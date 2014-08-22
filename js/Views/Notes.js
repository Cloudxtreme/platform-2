Cloudwalkers.Views.Notes = Cloudwalkers.Views.Pageview.extend({
	
	'title' : 'Notes',
	'className' : "container-fluid inbox inbox-notes",
			
	'initialize' : function(options)
	{
		this.model = Cloudwalkers.Session.getAccount();
	},

	'render' : function()
	{
		// Create pageview
		this.$el.html (Mustache.render (Templates.pageview, {'title' : this.title}));
		this.$container = this.$el.find("#widgetcontainer").eq(0);
		
		// Dedect childtype
		//this.options.channel.childtype = this.options.type.slice(0, -1);
		
		var params = {
			'check' : "hasnotes",
			'collectionstring' : "notes",
			'listtype' : 'notes',
			model: this.model
		}

		// Add list widget
		var list = new Cloudwalkers.Views.Widgets.InboxNotesList(params);
		
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
	}
});