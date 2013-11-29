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
		
		if(this.options.stream)
		{
				this.options.stream.messages = new Cloudwalkers.Collections.Messages([], {id: this.options.stream.id, endpoint: "stream"});
				var messages = this.options.stream.messages;
		} else	var messages = this.options.channel.messages;
		
		messages.hook({success: this.fill.bind(this), error: this.fail, records: 10});

		return this;
	},
	
	'fill' : function (collection)
	{	
		this.$el.find('.inner-loading').toggleClass(collection.length? 'inner-loading': 'inner-empty inner-loading');
		
		var $container = this.$el.find(".messages-container").eq(-1);
		
		// Go trough all messages
		var type = (this.options.type == "news" || this.options.type == "profiles")? "trending": this.options.type; 
		
		collection.each (function (message)
		{
			var parameters = {
				'model' : message,
				'template' : 'messageentry',
				'link' : true,
				'type' : type
			};
			
			var messageView = new Cloudwalkers.Views.Entry (parameters);
			messageView.clickable(this.options.link);
			
			$container.append(messageView.render().el);
		}.bind(this));
		
		
		/*messages.each(function(entry){
			
			var data = entry.filterData();
			
			this.$el.find(".messages-container").append(Mustache.render (Templates.messageentry, data));
			
		}.bind(this));*/
		
	
		
		
		
		
		//if(messages.length)
		//	this.$el.find('.inner-loading').removeClass('inner-loading');
		
		
		/*messages.each( function(message)
		{

			this.$el.append("<div>Foo</div>");//" + message.get("body").html + "
			
		}.bind(this));*/
		
		/*var report = this.stream.reports.findWhere({uniqueid: this.options.type});
		
		if(!report) return null;
		
		this.$el.html (Mustache.render (Templates[this.template],
		{
			dashbaord: this.dashboard,
			streamid: this.stream.id,
			network: this.stream.get("network"),
			details: report.getDetails()

		}));
		
		this.trigger ('content:change');*/

	},
	
	'fail' : function ()
	{
		Cloudwalkers.RootView.growl ("Oops", "Something went sideways, please reload the page.");
	}

});