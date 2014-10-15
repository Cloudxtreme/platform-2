define(
	['Views/Pageview', 'mustache',  'Views/Root', 'Views/Widgets/SentMessageList'],
	function (Pageview, Mustache, RootView, SentMessageListWidget)
	{
		var Sent = Pageview.extend({
	
			title : 'Sent',
			className : "container-fluid inbox",
					
			initialize : function(options)
			{
				this.model = Cloudwalkers.Session.getStream("sent");
				
				// Memory cloth
				var settings = Cloudwalkers.Session.viewsettings('sent');
				
				if (settings.streams)
					this.options.filters = {contacts : {string:"", list:[]}, streams : settings.streams};
			},

			render : function()
			{	
				// Create pageview
				this.$el.html (Mustache.render (Templates.pageview, {'title' : this.title}));
				this.$container = this.$el.find("#widgetcontainer").eq(0);
				
				this.options.model = this.model;

				// Add list widget
				var list = new SentMessageListWidget(this.options);
				
				this.appendWidget(list, 4);
				this.appendhtml(Templates.inboxcontainer);
				
				return this;
			},

			resize : function(height)
			{
				this.$el.find("#widgetcontainer").height(height -140);
			},
			
			finish : function()
			{
				
				this.resize(Cloudwalkers.RootView.height());
				
				// Add scroller for message
				$message = this.$el.find(".inbox-container").wrap("<div class='scroller'>");
				
				$message.parent().slimScroll({height: "inherit"});
			}
		});

		return Sent;
	}
);