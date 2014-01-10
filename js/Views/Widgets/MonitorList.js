Cloudwalkers.Views.Widgets.MonitorList = Cloudwalkers.Views.Widgets.Widget.extend({

	'id' : 'monitorparent',
	'entries' : [],
	
	'events' : {
		'remove' : 'destroy',
		'click .load-more' : 'more'
	},
	
	'initialize' : function ()
	{
		this.category = this.options.category;		

		// Clear the category (prevent non-change view failure)
		this.category.set({messages: []});
		
		// Listen to category
		this.listenTo(this.category.messages, 'seed', this.fill);
		this.listenTo(this.category.messages, 'request', this.showloading);
		this.listenTo(this.category.messages, 'sync', this.hideloading);
		// this.listenTo(this.category, 'change:messages', this.fill);
		// this.listenTo(this.category, 'request', this.showloading);
		// this.listenTo(this.category, 'sync', this.hideloading);
		
		// Load category messages
		// this.category.fetch({endpoint: "messageids", parameters:{records: 25}});
	},

	'render' : function ()
	{
		// Get template
		this.$el.html (Mustache.render (Templates.monitorlist, {name: this.category.get("name") }));
		
		this.$container = this.$el.find ('.messages-container');
		this.$el.find(".load-more").hide();
		
		// Load category message
		this.category.messages.touch(this.category, {records: 40});
		
		return this;
	},
	
	'showloading' : function ()
	{
		this.$el.find(".icon-cloud-download").show();
		this.$el.find(".load-more").hide();
	},
	
	'hideloading' : function ()
	{
		this.$el.find(".icon-cloud-download").hide();
		this.$el.find(".load-more").show();
		
		this.$container.removeClass("inner-loading");
	},
	
	'fill' : function (list)
	{		
		// Clean load or add
		if(this.incremental) this.incremental = false;
		else
		{
			$.each(this.entries, function(n, entry){ entry.remove()});
			this.entries = [];
		}
		
		// Get messages
		//var messages = this.category.messages.seed(ids);
		
		// Add messages to view
		for (n in list)
		{
			//var message = Cloudwalkers.Session.getMessage(ids[n]);
			
			var view = new Cloudwalkers.Views.Entry ({model: list[n], type: "full", template: "messagefullentry"});
			this.entries.push (view);
			
			this.$container.append(view.render().el);
		}
	},
	
	/*'fill' : function (category, ids)
	{
		// Clean load or add
		if(this.incremental) this.incremental = false;
		else
		{
			$.each(this.entries, function(n, entry){ entry.remove()});
			this.entries = [];
		}
		
		// Get messages
		var messages = this.category.messages.seed(ids);
		//Cloudwalkers.Session.getMessages().seed(ids);
		
		// Add messages to view
		for (n in messages)
		{
			//var message = Cloudwalkers.Session.getMessage(ids[n]);
			
			var messageView = new Cloudwalkers.Views.Entry ({model: messages[n], type: "full", template: "messagefullentry"});
			this.entries.push (messageView);
			
			this.$container.append(messageView.render().el);
		}
	},*/
	
	'more' : function ()
	{
		this.incremental = true;
		
		var hasmore = this.category.messages.more(this.category, this.category.parameters);
		
		if(!hasmore) this.$el.find(".load-more").hide();
	},
	
	/*'more' : function ()
	{
		this.incremental = true;
		
		// update parameters with after cursor	
		var param = this.category.parameters;
		param.after = this.category.get("paging").cursors.after;
		
		this.category.fetch({endpoint: "messageids", parameters:param})
		
	},*/
	
	'negotiateFunctionalities' : function() {
		
		this.listenTo(Cloudwalkers.Session, 'destroy:view', this.remove);
		
		this.addScroll();
	},
	
	'addScroll' : function () {

		this.$el.find('.scroller').slimScroll({
			size: '6px',
			color: '#a1b2bd',
			height: $("#inner-content").height() -165 + "px",
			alwaysVisible: false,
			railVisible: false
		});
	},
	
	'destroy' : function()
	{
		$.each(this.entries, function(n, entry){ entry.remove()});
	}
});