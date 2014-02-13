Cloudwalkers.Views.Widgets.ScheduledFilters = Cloudwalkers.Views.Widgets.Widget.extend ({
	
	'id' : "scheduledfilters",
	'filters' : {
		users : {string:"", list:[]}
	},
	'events' : {
		'remove' : 'destroy',
		'click *[data-streams]' : 'filter',
		'click .toggleall.active' : 'toggleall',
	},
	
	'initialize' : function (options)
    {
		if(options) $.extend(this, options);

		this.model.childtype = "message";
		this.streams = Cloudwalkers.Session.getChannel ('internal').get ("additional").outgoing;

    },

	'render' : function ()
	{
		var params = {streams: []};
		
		// Company streams
		for(n in this.streams)
			params.streams.push({id: this.streams[n].id, icon: this.streams[n].network.icon, name: this.streams[n].name, network: this.streams[n].network}); 
		
		// View
		this.$el.html (Mustache.render (Templates.scheduledfilters, params));
		
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
	
	'filter' : function (e, all)
	{
		
		// Check button state
		if(!all)
			all = this.button && this.button.data("streams") == $(e.currentTarget).data("streams");

		this.togglefilters(all);
		
		if(!all)
			this.button = $(e.currentTarget).addClass('active').removeClass('inactive');
		
		var streams = all? null: this.button.data("streams");
		
		if(all) this.button = false;

		// Fetch filtered messages
		this.model.messages.touch(this.model, streams? {records: 20, streams: streams} : {records: 40});
		
		return this;
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