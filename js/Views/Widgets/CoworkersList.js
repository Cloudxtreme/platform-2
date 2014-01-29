Cloudwalkers.Views.Widgets.CoworkersList = Cloudwalkers.Views.Widgets.Widget.extend({

	'id' : 'coworkersparent',
	'title': "Co-workers messages",
	'parameters' : {records: 20},
	'entries' : [],
	
	'events' : {
		'remove' : 'destroy',
		'click .load-more' : 'more'
	},
	
	'initialize' : function (options)
	{
		if(options) $.extend(this, options);	
		
		// Add collection
		if (!this.model.messages) this.model.messages = new Cloudwalkers.Collections.Messages();
		
		// Listen to model messages and users
		this.listenTo(this.model.messages, 'seed', this.fill);
		this.listenTo(this.model.messages, 'request', this.showloading);
		//this.listenTo(this.model.messages, 'sync', this.hideloading);
	},

	'render' : function (params)
	{	
		// Get template
		this.$el.html (Mustache.render (Templates.coworkerslist, {title: this.title }));
		
		this.$container = this.$el.find ('.messages-container');
		this.$el.find(".load-more").hide();
		
		// Load category message
		this.model.messages.touch(this.model, params? params: this.paramters);
		
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
		this.$container.removeClass("inner-loading");
		
		if (this.model.messages.cursor)
			this.$el.find(".load-more").show();
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
			var view = new Cloudwalkers.Views.Entry ({model: list[n], type: "full", template: "coworkersmessage"});
			this.entries.push (view);

			// Filter user
			if (list[n].get("from")) this.model.seedusers(list[n]);
			
			else this.listenTo(list[n], "change:from", this.model.seedusers.bind(this.model))
			
			this.$container.append(view.render().el);
		}
		
		// Hide loading
		this.hideloading();
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
		
		//console.log(parameters)
		
		var hasmore = this.model.messages.more(this.model, this.parameters); //this.model.parameters);
		
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