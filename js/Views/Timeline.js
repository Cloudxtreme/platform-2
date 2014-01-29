Cloudwalkers.Views.Timeline = Cloudwalkers.Views.Pageview.extend({
	
	'id' : "timeline",
	'parameters': { 'records' : 20 },
	'entries' : [],
	'events' : 
	{
		'click *[data-action]' : 'action',
		'click .load-more' : 'more'
	},
	
	'initialize' : function (options)
	{
		if (options) $.extend(this, options);
		
		this.collection = this.model.messages;
		
		// Listen to model
		this.listenTo(this.collection, 'seed', this.fill);
		this.listenTo(this.collection, 'request', this.showloading);
		//this.listenTo(this.collection, 'sync', this.hideloading);
	},
	
	'showloading': function()
	{
		this.$el.addClass("loading");
		//this.$el.find(".timeline-loading").show();
	},
	
	'hideloading': function()
	{
		this.$el.removeClass("loading");
		//this.$el.find(".timeline-loading").hide();
	},
	
	'render' : function ()
	{

		// Network filters
		var params = {} // {networks: this.model.streams.filterNetworks(null, true)};
		
		// Pageview
		this.$el.html (Mustache.render (Templates.timeline, params));
		
		this.$container = this.$el.find("ul.timeline").eq(0);
		this.$loadmore = this.$el.find(".load-more").remove();
		
		// Load messages
		this.collection.touch(this.model, this.filterparameters());

		return this;
	},
		
	'filterparameters' : function()
	{
		return this.parameters;
	},
	
	'fill' : function (models)
	{
		// Clean load or add
		if(this.incremental) this.incremental = false;
		else
		{
			$.each(this.entries, function(n, entry){ entry.remove()});
			this.entries = [];
		}

		// Add models to view
		for (n in models)
		{
			var view = new Cloudwalkers.Views.Entry ({model: models[n], template: 'messagetimeline', type: this.trending? 'fulltrending': 'full'});
			
			this.entries.push (view);
			
			this.$container.append(view.render().el);
		}
		
		// Add loadmore button
		if (models.length)
			this.$container.append(this.$loadmore);
		
		this.hideloading();
	},

	'more' : function ()
	{
		this.incremental = true;
		
		var hasmore = this.collection.more(this.model, this.filterparameters());
		
		if(!hasmore) this.$el.find(".load-more").hide();
	}

});

/*Cloudwalkers.Views.Timeline = Cloudwalkers.Views.Widgets.WidgetContainer.extend({

	'title' : false,
	'widgets' : {}
	
});*/