Cloudwalkers.Views.ManageKeywords = Cloudwalkers.Views.Pageview.extend({

	'title' : 'Manage Keywords',
	
	'render' : function()
	{
		this.$el.html (Mustache.render (Templates.pageview, { 'title' : this.title }));
		
		this.$el.addClass("container-fluid managekeywords");
		this.$container = this.$el.find("#widgetcontainer").eq(0);

		// Add edit widget
		var editor = new Cloudwalkers.Views.Widgets.KeywordsEditor();
		this.appendWidget(editor, 4);
		
		// Add overview widget
		var list = new Cloudwalkers.Views.Widgets.KeywordsOverview({editor: editor});
		this.appendWidget(list, 8);
		
		// Listen to channels for limit.
		setTimeout(this.limitlistener, 50);
		this.listenTo(Cloudwalkers.Session.getChannels(), 'sync remove', this.limitlistener);
		
		this.widgets = [editor, list];
		
		return this;
	},
	
	'limitlistener' : function()
	{
		var limit = Cloudwalkers.Session.getChannel("monitoring").channels.reduce(function(p, n){ return ((typeof p == "number")? p: p.get("channels").length) + n.get("channels").length });
		
		Cloudwalkers.Session.getAccount().monitorlimit('keywords', limit, ".add-keyword");
	}

});