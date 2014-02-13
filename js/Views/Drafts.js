Cloudwalkers.Views.Drafts = Cloudwalkers.Views.Pageview.extend({

	'title' : 'Drafts',
	'className' : "container-fluid drafts",
	
	'initialize' : function ()
	{
		// Select draft stream (should be integrated)
		var channel = Cloudwalkers.Session.getChannel("internal");
		
		this.model = channel.getStream("draft");

		// Emergency break
		if (!this.model) return Cloudwalkers.Session.home();
		
		// Listen for changes
		this.listenTo(this.model, 'outdated', this.model.fetch);
		this.listenTo(this.model, 'sync', this.render);
	},
	
	'render' : function()
	{
		this.$el.html (Mustache.render (Templates.pageview, { 'title' : this.title }));
		this.$container = this.$el.find("#widgetcontainer").eq(0);

		// Add filter widget
		var filter = new Cloudwalkers.Views.Widgets.DraftsFilters ({model: this.model});
		this.appendWidget(filter, 4);
		
		// Add list widget
		var list = new Cloudwalkers.Views.Widgets.DraftsList ({model: this.model});
		this.appendWidget(list, 8);
		
		filter.list = list;
		
		return this;
	}
	
});