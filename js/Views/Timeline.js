Cloudwalkers.Views.Timeline = Cloudwalkers.Views.Pageview.extend({
	
	'id' : "timeline",
	'parameters': { records: 20, markasread: true },
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
		
		this.$el.addClass("loading");
		
		// Listen to model
		this.listenTo(this.collection, 'seed', this.fill);
		//this.listenTo(this.collection, 'request', this.showloading);
		//this.listenTo(this.collection, 'sync', this.hideloading);
	},
	
	/*'showloading': function()
	{
		
		//this.$el.find(".timeline-loading").show();
	},*/
	
	'hideloading': function()
	{
		this.$el.removeClass("loading");
		this.$el.find(".timeline-loading").hide();
	},
	
	'render' : function ()
	{
		// Network filters
		var params = {} // {networks: this.model.streams.filterNetworks(null, true)};
		
		//Mustache Translate Render
		this.mustacheTranslateRender(params);

		// Pageview
		this.$el.html (Mustache.render (Templates.timeline, params));
		
		this.$container = this.$el.find("ul.timeline").eq(0);
		this.$loadmore = this.$el.find(".load-more").remove();
		this.$nocontent = this.$el.find(".no-content").remove();
		
		// Load messages
		this.collection.touch(this.model, this.filterparameters());

		this.resize(Cloudwalkers.RootView.height());

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

			var view = new Cloudwalkers.Views.Entry ({model: models[n], template: 'newmessagetimeline', type: 'full', parameters:{trendview: this.trending}/*, parameters: this*/});
			
			this.entries.push (view);
			
			this.$container.append(view.render().el);
		}
		
		// Add loadmore button
		if (this.collection.cursor)
			this.$container.append(this.$loadmore);
		
		else if(!models.length)
			this.$container.append(this.$nocontent);
		
		this.hideloading();
	},

	'more' : function ()
	{
		this.incremental = true;
		
		var hasmore = this.collection.more(this.model, this.filterparameters());
		
		if(!hasmore) this.$el.find(".load-more").hide();
	},

	'resize' : function(height)
	{	
		this.$el.css('min-height', height);
	},

	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	},

	'mustacheTranslateRender' : function(translatelocation)
	{
		// Translate array
		this.original  = [
			"loading",
			"view_more",
			"no_messages",
			"comments"
		];

		this.translated = [];

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}
	}
});

/*Cloudwalkers.Views.Timeline = Cloudwalkers.Views.Widgets.WidgetContainer.extend({

	'title' : false,
	'widgets' : {}
	
});*/