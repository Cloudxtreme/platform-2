/**
* A standard widget
*/
Cloudwalkers.Views.Widgets.DashboardMessageList = Cloudwalkers.Views.Widgets.MessageContainer.extend({

	'template' : 'dashboardmessagecontainer',
	'messagetemplate' : 'dashboardmessage',
	
	'initialize' : function()
	{
		//this.options.title = this.options.channel.get("name");
		
		this.initializeWidget ();
	},

	'render' : function ()
	{
		this.$el.html (Mustache.render (Templates.dashboardmessagecontainer, this.options));
		
		if(this.options.streamid)
		{
				// HACK! Stream model should already exist
				//this.options.stream.messages = new Cloudwalkers.Collections.Messages([], {id: this.options.stream.id, endpoint: "stream"});
				var messages = new Cloudwalkers.Collections.Messages([], {id: this.options.streamid, endpoint: "stream"});
		} else	var messages = this.options.channel.messages;
		
		messages.hook({success: this.fill.bind(this), error: this.fail, records: 10});

		return this;
	},
	
	'fill' : function (collection, b)
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
		

	},
	
	'fail' : function ()
	{
		Cloudwalkers.RootView.growl ("Oops", "Something went sideways, please reload the page.");
	}

});