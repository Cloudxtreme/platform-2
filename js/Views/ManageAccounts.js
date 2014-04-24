Cloudwalkers.Views.ManageAccounts = Cloudwalkers.Views.Pageview.extend({
	
	'id' : 'manageaccounts',
	'className' : "container-fluid",
	'title' : 'Manage Accounts',
	
	'initialize' : function (options)
	{
		if(options) $.extend(this, options);
	
		// Which collection to focus on
		this.collection = this.channel.messages;
		
		// console.log(Cloudwalkers.Session.getChannel("news"))
	},
	
	'render' : function()
	{
		// Select Networks
		var networks = this.channel.streams.filterNetworks(null, true);
		
		// Template
		this.$el.html (Mustache.render (Templates.manageaccounts, {title: this.title, networks: networks}));
		
		
		/*// Listen to channels for limit.
		setTimeout(this.limitlistener, 50);
		this.listenTo(Cloudwalkers.Session.getChannels(), 'sync remove', this.limitlistener);
		
		
		
		this.$container = this.$el.find("#widgetcontainer").eq(0);

		// Add edit widget
		var editor = new Cloudwalkers.Views.Widgets.KeywordsEditor();
		this.appendWidget(editor, 4);
		
		// Add overview widget
		var list = new Cloudwalkers.Views.Widgets.KeywordsOverview({editor: editor});
		this.appendWidget(list, 8);

		this.widgets = [editor, list];*/
		
		return this;
	},
	
	'limitlistener' : function()
	{
		var limit = Cloudwalkers.Session.getChannel("monitoring").channels.reduce(function(p, n){ return ((typeof p == "number")? p: p.get("channels").length) + n.get("channels").length });
		
		Cloudwalkers.Session.getAccount().monitorlimit('keywords', limit, ".add-keyword");
	}

});