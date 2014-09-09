Cloudwalkers.Views.Timeline = Cloudwalkers.Views.Pageview.extend({
	
	'id' : "timeline",
	'parameters': { records: 20, markasread: true },
	'entries' : [],

	'events' : 
	{
		'click *[data-action]' : 'action',
		'click .load-more .more' : 'more',
		'click [data-network-streams]' : 'filternetworks',
		'click .toggleall.networks.active' : 'toggleallnetworks'
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

		this.$el.find('.load-more .timeline-icon').removeClass('entry-loading');
		this.$el.find('.load-more .timeline-body span').html(this.translateString('view_more'));
	},
	
	'render' : function ()
	{
		// Network filters
		var params = {networks: this.model.streams.filterNetworks(null, true)};
		
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
			//Company / third party
			models[n].attributes.showcontact = this.showcontact;
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

	'toggleallnetworks' : function (all)
	{
		this.filternetworks(null, true);
		this.togglefilters(all, ".network-list");
	},

	'togglefilters' : function(all, selector)
	{
		// Toggle streams
		this.$el.find(selector + " .filter").addClass(all? 'active': 'inactive').removeClass(all? 'inactive': 'active');
		
		// Toggle select button
		$(selector + " .toggleall").addClass(all? 'inactive': 'active').removeClass(all? 'active': 'inactive');
	},

	'filternetworks' : function (e, all)
	{
		//console.log(e, all)
		// Check button state
		if(!all)
			all = this.button && this.button.data("network-streams") == $(e.currentTarget).data("network-streams");

		this.togglefilters(all, ".network-list");
		
		if(!all)
			this.button = $(e.currentTarget).addClass('active').removeClass('inactive');
		
		var streams = all? null: String(this.button.data("network-streams")).split(" ");
		
		if(all) this.button = false;
		
		// Add ids
		if(streams) this.parameters.streams = streams.join(",");
		else delete this.parameters.streams;

		this.collection.trigger('change:filter');
		this.collection.touch(this.category, this.parameters);

		return this;
		
	},

	'more' : function ()
	{
		this.incremental = true;

		this.$el.find('.load-more .timeline-icon').addClass('entry-loading');
		this.$el.find('.load-more .timeline-body span').html(this.translateString('loading')+'...');
		
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
			"comments",
			"filters",
			"select_all"
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