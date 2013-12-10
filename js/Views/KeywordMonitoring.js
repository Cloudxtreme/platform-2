Cloudwalkers.Views.KeywordMonitoring = Cloudwalkers.Views.Pageview.extend({

	'title' : 'Keyword Monitoring',
	'widgets' : {},
	
	'initialize' : function ()
	{
		
		// Emergency breaks
		if (!this.options.category) return Cloudwalkers.Session.home();
		
		this.category = this.options.category;
		
		/*// Parameters
		var channel = Cloudwalkers.Session.getChannel (id);
		var category = channel.get("channels").filter(function(cat){ return cat.id == catid }).pop();//Cloudwalkers.Session.getChannel (catid);
		
		if (!channel || !category) return this.home();
		
		// Visualisation
		var widgetcontainer = new Cloudwalkers.Views.Widgets.WidgetContainer ({title: "Keyword monitoring"});//({name: channel.get("name")});
		widgetcontainer.templatename = "keywordcontainer"; 
		
		var keywordfilter = new Cloudwalkers.Views.Widgets.ChannelFilters ({ 'category' : category }); //ChannelFilters ({ 'channel' : channel, 'name' : channeldata.name });
		widgetcontainer.add (keywordfilter, 4);
		
		var listwidget = new Cloudwalkers.Views.Widgets.MonitorList ({ 'category' : category, 'streams': keywordfilter.streams, 'keywords': keywordfilter.keywords });
		widgetcontainer.add (listwidget, 8);
		
		Cloudwalkers.RootView.setView (widgetcontainer);*/
		
		
	},
	
	'render' : function()
	{
		this.$el.html (Mustache.render (Templates.pageview, { 'title' : this.title }));
		
		this.$el.addClass("container-fluid monitoring");
		this.$container = this.$el.find("#widgetcontainer").eq(0);


		// Add filter widget
		var filter = new Cloudwalkers.Views.Widgets.CategoryFilters ({ 'category' : this.category });
		this.appendWidget(filter, 4);
		
		// Add list widget
		var list = new Cloudwalkers.Views.Widgets.MonitorList ({ 'category' : this.category, 'streams': filter.streams, 'keywords': filter.keywords });
		this.appendWidget(list, 8);
		
		return this;
	}
	
});