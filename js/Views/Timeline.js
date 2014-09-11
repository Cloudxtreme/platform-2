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
	
	'render' : function (streams)
	{
		var params;

		if(!streams)
			streams = null;

		// Network filters
		if( this.model.streams) //Its a channel
			params = {networks: this.model.streams.filterNetworks(null, true)};
		else					//It's a stream, so it's company accounts time!
		{
			params = {};

			var channelid = this.model.get('channels')? this.model.get('channels')[0]: null;

			if(channelid){
				var channel = Cloudwalkers.Session.getChannel(Number(channelid));

				params = {networks: channel.streams.filterNetworks(null, true)};

				if(streams){
					this.model = channel;
					this.collection = this.model.messages;
					this.listenTo(this.collection, 'seed', this.fill);
				}
			}
		}					

		//Mustache Translate Render
		this.mustacheTranslateRender(params);

		// Pageview
		this.$el.html (Mustache.render (Templates.timeline, params));
		
		this.$container = this.$el.find("ul.timeline").eq(0);
		this.$loadmore = this.$el.find(".load-more").remove();
		this.$nocontent = this.$el.find(".no-content").remove();
		
		// Load messages
		this.collection.touch(this.model, this.filterparameters(streams));

		if(streams)
			this.togglefilters(streams);

		this.resize(Cloudwalkers.RootView.height());

		return this;
	},
		
	'filterparameters' : function(streams)
	{
		var param;

		param = this.parameters;

		param.streams = "";

		if(streams){
			param.streams = streams.join(",");
		}

		return param;

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
		this.$el.find("[data-network-streams]").addClass('inactive').removeClass('active');;	
		this.$el.find("[data-network-streams='" + streams + "']").addClass('active').removeClass('inactive');;		
		
		// Toggle select button
		this.$el.find(".toggleall").addClass('active').removeClass('inactive');
	},

	'filternetworks' : function (e, all)
	{
		//console.log(e, all)
		// Check button state
		if(!all)
			all = this.button && this.button.data("network-streams") == $(e.currentTarget).data("network-streams");

		//this.togglefilters(all, ".network-list");
		
		if(!all)
			this.button = $(e.currentTarget).addClass('active').removeClass('inactive');
		
		var streams = all? null: String(this.button.data("network-streams")).split(" ");
		
		this.render(streams);

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