Cloudwalkers.Views.Widgets.MonitorList = Cloudwalkers.Views.Widgets.Widget.extend({

	'id' : 'monitorparent',
	'entries' : [],
	
	'events' : {
		'click .load-more' : 'more'
	},
	
	'initialize' : function ()
	{
		this.category = this.options.category;		

		// Clear the category (prevent non-change view failure)
		this.category.set({messages: []});
		
		// Listen to category
		this.listenTo(this.category, 'change:messages', this.fill);
		this.listenTo(this.category, 'request', this.showloading);
		this.listenTo(this.category, 'sync', this.hideloading);
		
		// Load category messages
		this.category.fetch({endpoint: "messageids", parameters:{records: 25}});
	},

	'render' : function ()
	{
		// Get template
		this.$el.html (Mustache.render (Templates.monitorlist, {name: this.category.get("name") }));
		
		this.$container = this.$el.find ('.messages-container');
		this.$el.find(".load-more").hide();
		
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
	
	'fill' : function (category, ids)
	{
		// Clean load or add
		if(this.incremental) this.incremental = false;
		else
		{
			$.each(this.entries, function(n, entry){ entry.remove()});
			this.entries = [];
		}
		
		// Activate messages
		Cloudwalkers.Session.getMessages().seed(ids);
		
		// Add messages to view
		for (n in ids)
		{
			var message = Cloudwalkers.Session.getMessage(ids[n])
			message.channel = this.category;
			
			var messageView = new Cloudwalkers.Views.Entry ({model: message});
			this.entries.push (messageView);
			
			this.$container.append(messageView.render().el);
		}
	},
	
	'more' : function ()
	{
		this.incremental = true;
		
		// update parameters with after cursor	
		var param = this.category.parameters;
		param.after = this.category.get("paging").cursors.after;
		
		this.category.fetch({endpoint: "messageids", parameters:param})
		
	},
	
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
	}
});