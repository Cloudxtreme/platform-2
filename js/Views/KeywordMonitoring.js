Cloudwalkers.Views.KeywordMonitoring = Cloudwalkers.Views.Pageview.extend({

	'title' : 'Keyword Monitoring',
	'widgets' : {},
	
	'initialize' : function ()
	{
		// Emergency break
		if (!this.options.category) return Cloudwalkers.Session.home();
		
		// Listen for changes
		//this.listenTo(Cloudwalkers.Session.getChannels(), 'sync', this.render);
		//this.listenTo(Cloudwalkers.Session.getStreams(), 'sync', this.render);
		
		this.category = this.options.category;
	},
	
	'render' : function()
	{
		this.$el.html (Mustache.render (Templates.pageview, { 'title' : this.title }));
		
		this.$el.addClass("container-fluid monitoring");
		this.$container = this.$el.find("#widgetcontainer").eq(0);


		// Add filter widget
		var filter = new Cloudwalkers.Views.Widgets.MonitorFilters ({category: this.category });
		this.appendWidget(filter, 4);
		
		// Add list widget
		var list = new Cloudwalkers.Views.Widgets.MonitorList ({category: this.category});
		this.appendWidget(list, 8);
		
		return this;
	}
	
});