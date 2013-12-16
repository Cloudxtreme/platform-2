/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.DashboardMessageList = Cloudwalkers.Views.Widgets.MessageContainer.extend({

	'template' : 'dashboardmessagecontainer',
	'messagetemplate' : 'dashboardmessage',
	'entries' : [],
	
	'initialize' : function()
	{
		
		this.model = this.options.model;		

		// Clear the category (prevent non-change view failure)
		this.model.set({messages: []});
		
		// Listen to category
		this.listenTo(this.model, 'change:messages', this.fill);
		
		this.initializeWidget ();
	},

	'render' : function ()
	{
		this.$el.html (Mustache.render (Templates.dashboardmessagecontainer, this.options));
		this.$container = this.$el.find ('.messages-container');
		
		if(!this.options.filters) this.options.filters = {};
		this.options.filters.records = 10;
		
		// Load category messages
		this.model.fetch({endpoint: "messageids", parameters:this.options.filters});
		
		
		//if(this.options.streamid)
		//{
				// HACK! Stream model should already exist
				//this.options.stream.messages = new Cloudwalkers.Collections.Messages([], {id: this.options.stream.id, endpoint: "stream"});
				//var messages = new Cloudwalkers.Collections.Messages([], {id: this.options.streamid, endpoint: "stream"});
		//} else	var messages = this.options.channel.messages;
		
		
		//if(this.options.model)
		//	this.options.model.messages.hook({success: this.fill.bind(this), error: this.fail, records: 10});

		return this;
	},
	
	'fill' : function (model, ids)
	{
		
		this.$el.find('.inner-loading').toggleClass(ids.length? 'inner-loading': 'inner-empty inner-loading');
		
		// Clean load or add
		if(this.incremental) this.incremental = false;
		else
		{
			$.each(this.entries, function(n, entry){ entry.remove()});
			this.entries = [];
		}
		
		// Go trough all messages
		var type = (this.options.type == "news" || this.options.type == "profiles")? "trending": this.options.type; 
		
		// Get messages
		var messages = this.model.messages.seed(ids);
		
		// Add messages to view
		for (n in messages)
		{
			if(this.options.link) messages[n].link = this.options.link;
			
			var messageView = new Cloudwalkers.Views.Entry ({model: messages[n], template: 'smallentry', type: type});
			this.entries.push (messageView);
			
			this.$container.append(messageView.render().el);
		}
	},
	
	/*'fill' : function (collection)
	{	
		
		// console.log(this.options.link, collection, b)
		
		this.$el.find('.inner-loading').toggleClass(collection.length? 'inner-loading': 'inner-empty inner-loading');
		
		var $container = this.$el.find(".messages-container").eq(-1);
		
		// Go trough all messages
		var type = (this.options.type == "news" || this.options.type == "profiles")? "trending": this.options.type; 
		
		collection.each (function (message)
		{
			var data = {
				'model' : message,
				'template' : 'smallentry',
				'type' : type
			};
			
			if(this.options.link) message.link = this.options.link;
			
			var messageView = new Cloudwalkers.Views.Entry (data);
			
			$container.append(messageView.render().el);
		}.bind(this));
		

	},*/
	
	'fail' : function ()
	{
		Cloudwalkers.RootView.growl ("Oops", "Something went sideways, please reload the page.");
	}

});