Cloudwalkers.Views.Widgets.CalendarFilters = Cloudwalkers.Views.Widgets.Widget.extend ({
	
	'id' : "calendarfilters",
	'filters' : {},
	'events' : {
		'remove' : 'destroy',
		'click [data-networks]' : 'filternetworks',
		'click [data-streams]' : 'filterstreams',
		'click .toggleall.active' : 'toggleall'
	},
	
	'initialize' : function (options)
    {
		if(options) $.extend(this, options);

		// Collection
		this.collection = this.model.messages;
		
		// Available Streams
		this.streams = Cloudwalkers.Session.getChannel ('internal').get ("additional").outgoing;

    },

	'render' : function ()
	{
		var params = {streams: []};
		
		// Company streams
		for(n in this.streams)
			params.streams.push({id: this.streams[n].id, icon: this.streams[n].network.icon, name: this.streams[n].name, network: this.streams[n].network}); 
		
		// Select networks
		params.networks = this.model.streams.filterNetworks(params.streams, true);
		
		// View
		this.$el.html (Mustache.render (Templates.calendarfilters, params));
		
		return this;
	},
	
	'toggleall' : function ()
	{
		
		this.filter(true);
		this.togglefilters(true);
	},
	
	'togglefilters' : function(all)
	{
		
		
		
		// Toggle streams
		this.$el.find('li').addClass(all? 'active': 'inactive').removeClass(all? 'inactive': 'active');
		
		// Toggle select button
		this.$el.find('.toggleall').addClass(all? 'inactive': 'active').removeClass(all? 'active': 'inactive');
	},
	
	'togglestreams' : function(all)
	{
		// Toggle streams
		this.$el.find('[data-networks], [data-streams]').addClass(all? 'active': 'inactive').removeClass(all? 'inactive': 'active');
		
		// Toggle select button
		this.$el.find('.toggleall').addClass(all? 'inactive': 'active').removeClass(all? 'active': 'inactive');
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
		
		// Enter streams
		this.filterparameters();
		
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
		// this.collection.touch(this.model, this.filterparameters());
		
		// Enter streams
		this.filterparameters();
		
		return this;
	},
	
	
	'filterparameters' : function() {
		
		// Enter streams
		if(this.filters.streams.length) this.calview.parameters.streams = this.filters.streams.join(",");
		else if(this.calview.parameters.streams) delete this.calview.parameters.streams;
		
		$("#calendar").fullCalendar('refetchEvents');
		
		/*var calview = $("#calendar").fullCalendar('getView');
		
		var params = {records: 999, since: calview.start.unix(), until: calview.end.unix()};
		
		// Enter streams
		if(this.filters.streams.length) params.streams = this.filters.streams.join(",");
		
		return params;*/
	},

	
	'fill' : function (models)
	{	
		
				
		// Clean load
		$.each(this.entries, function(n, entry){ entry.remove()});
		this.entries = [];
		
		// Add models to view
		for (n in models)
		{
			var view = new Cloudwalkers.Views.User ({model: models[n], template: 'smalluser', type: 'listitem'});
			
			this.entries.push (view);
			this.listenTo(view, "select", this.select);
			
			this.$container.append(view.render().el);
		}
		
		// End loading
		this.$el.find(".inner-loading").removeClass("inner-loading")
	},
	
	'select' : function(view)
	{	
		// Render list
		this.list.render({users: view.model.id, records: 20});
		/*
		this.list.model.messages.touch(this.list.model, {records: 20, users: view.model});*/
	},
	
	'addScroll' : function () {

		this.$el.find('.scroller').slimScroll({
			size: '6px',
			color: '#a1b2bd',
			height: $("#inner-content").height() -165 + "px",
			alwaysVisible: false,
			railVisible: false
		});
	}
});