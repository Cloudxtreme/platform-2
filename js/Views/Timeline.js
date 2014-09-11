Cloudwalkers.Views.Timeline = Cloudwalkers.Views.Pageview.extend({
	
	'id' : "timeline",
	'parameters': { records: 20, markasread: true },
	'entries' : [],
	'check' : "hasMessages",
	'filters' : {
		streams : []
	},

	'events' : 
	{
		'click *[data-action]' : 'action',
		'click [data-toggle]' : 'togglefilter',
		'click [data-streams]' : 'filterstreams',
		'click .load-more .more' : 'more',
		'click [data-networks]' : 'filternetworks',
		'click .toggleall.networks.active' : 'toggleallnetworks',
		'click .toggleall.active' : 'toggleall',
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

	'toggleall' : function ()
	{
		this.filternetworks(null, true);
		this.togglestreams(true);
	},
	
	'render' : function ()
	{
		// Template data
		var param = {streams: [], networks: []};

		param = {networks: this.model.streams.filterNetworks(null, true), streams: []};

		this.model.streams.each (function(stream)
		{
			if(stream.get(this.check)) param.streams.push({id: stream.id, icon: stream.get("network").icon, name: stream.get("defaultname"), network: stream.get("network")}); 

		}.bind(this));	

		// Select networks
		param.networks = this.model.streams.filterNetworks(param.streams, true);

		//Mustache Translate Render
		this.mustacheTranslateRender(param);

		// Pageview
		this.$el.html (Mustache.render (Templates.timeline, param));

		// Set selected streams --> Need memory cloth array, to finish implementation
		if (this.filters.streams.length)
		{
			this.$el.find("[data-streams], [data-networks], .toggleall").toggleClass("inactive active");
			
			this.$el.find(this.filters.streams.map(function(id){ return '[data-networks~="'+ id +'"],[data-streams="'+ id +'"]'; }).join(",")).toggleClass("inactive active");
		}
		
		this.$container = this.$el.find("ul.timeline").eq(0);
		this.$loadmore = this.$el.find(".load-more").remove();
		this.$nocontent = this.$el.find(".no-content").remove();
		
		// Load messages
		this.collection.touch(this.model, this.filterparameters());

		this.resize(Cloudwalkers.RootView.height());

		return this;
	},

	'filternetworks' : function (e, all)
	{
		// Check button state
		if(!all)
			all = this.button && this.button.data("networks") == $(e.currentTarget).data("networks");

		this.togglestreams(all);
		
		if(!all)
			this.button = $(e.currentTarget).addClass('active').removeClass('inactive');
		
		var streams = all? null: String(this.button.data("networks")).split(" ");
		
		if(all) this.button = false;
		
		
		// Highlight related streams and fetch
		if (streams)
		{
			$(streams.map(function(id){ return '[data-streams="'+ id +'"]'; }).join(",")).removeClass("inactive").addClass("active");
			this.filters.streams = streams;
		
		} else this.filters.streams = [];
		
		// Fetch filtered messages
		//this.collection.touch(this.model, this.filterparameters());
		this.render();

		return this;
	},
	
	'filterstreams' : function (e, all)
	{	
		// Check button state
		if(!all)
			all = this.button && this.button.data("streams") == $(e.currentTarget).data("streams");

		this.togglestreams(all);
		
		if(!all)
			this.button = $(e.currentTarget).addClass('active').removeClass('inactive');
		
		var stream = all? null: Number(this.button.data("streams"));
		
		if(all) this.button = false;
		
		
		// Highlight related streams and fetch
		if (stream)
		{
			$('[data-networks~="'+ stream +'"]').removeClass("inactive").addClass("active");
			this.filters.streams = [stream];
			
		} else this.filters.streams = [];
			
		// Fetch filtered messages
		//this.collection.touch(this.model, this.filterparameters());
		this.render();
		
		return this;
	},
		
	'filterparameters' : function()
	{
		var param = this.parameters;

		if(this.filters.streams.length)
			param.streams = this.filters.streams.join(",");
		else
			param.streams = [];

		return param;

	},

	'togglefilter' : function(e)
	{
		var button = $(e.currentTarget);
		var toggle = button.data("toggle");
		var selected = button.hasClass("selected");
		
		this.$el.find("[data-toggle].selected").removeClass("selected");
		this.$el.find("[id^=filter_]").slideUp('fast');
		
		if(!selected)
		{
			button.addClass("selected");
			this.$el.find("#filter_" + toggle).slideDown('fast');
		}
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
	},

	'togglefilters' : function(streams)
	{
		streams = streams.join(" ");
		
		// Toggle streams
		this.$el.find("[data-network-streams]").removeClass('inactive');;	
		this.$el.find("[data-network-streams='" + streams + "']").addClass('inactive');		
		
		// Toggle select button
		this.$el.find(".toggleall").addClass('inactive');
	},
/*
	'filternetworks' : function (e, all)
	{
		//console.log(e, all)
		// Check button state
		if(!all)
			all = this.button && this.button.data("network-streams") == $(e.currentTarget).data("network-streams");

		//this.togglefilters(all, ".network-list");
		
		if(!all)
			this.button = $(e.currentTarget).addClass('inactive');
		
		var streams = all? null: String(this.button.data("network-streams")).split(" ");
		
		this.render(streams);

		return this;
		
	},

	'filterstreams' : function (e, all)
	{	
		// Check button state
		if(!all)
			all = this.button && this.button.data("streams") == $(e.currentTarget).data("streams");

		this.togglestreams(all);
		
		if(!all)
			this.button = $(e.currentTarget).addClass('active').removeClass('inactive');
		
		var stream = all? null: Number(this.button.data("streams"));
		
		if(all) this.button = false;
		
		
		// Highlight related streams and fetch
		if (stream)
		{
			$('[data-networks~="'+ stream +'"]').removeClass("inactive").addClass("active");
			this.parameters.streams = [stream];
			
		} else this.parameters.streams = [];
			
		// Fetch filtered messages
		this.collection.touch(this.model, this.filterparameters());
		
		return this;
	},
*/
	'togglestreams' : function(all)
	{
		// Toggle streams
		this.$el.find('[data-networks], [data-streams]').addClass(all? 'active': 'inactive').removeClass(all? 'inactive': 'active');
		
		// Toggle select button
		this.$el.find('.toggleall').addClass(all? 'inactive': 'active').removeClass(all? 'active': 'inactive');
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
			"select_all",
			"more"
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