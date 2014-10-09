define(
	['Views/Pageview', 'mustache',  'Views/Root', 'Views/Widgets/InboxMessageList', 'Views/Widgets/InboxNotificationList'],
	function (Pageview, Mustache, RootView, InboxMessageListWidget, InboxNotificationListWidget)
	{
		var Inbox = Pageview.extend({

			title : 'Inbox',
			className : "container-fluid inbox",
			
			initialize : function ()
			{
				// Memory cloth
				var settings = Cloudwalkers.Session.viewsettings(this.options.type);
				
				if (settings.streams)
					this.options.filters = {contacts : {string:"", list:[]}, streams : settings.streams};
			},
			
			render : function()
			{

				// Translated Title
				this.translate_title = this.translateString(this.options.type);

				// Create pageview

				this.$el.html (Mustache.render (Templates.pageview, {'title' : this.translate_title}));
				this.$container = this.$el.find("#widgetcontainer").eq(0);
				
				// Dedect childtype
				this.options.channel.childtype = this.options.type.slice(0, -1);
				
				// Add list widget
				var list = this.options.type == "messages"?
					
					new InboxMessageListWidget(this.options):
					new InboxNotificationListWidget(this.options);
				
				this.appendWidget(list, 4);
				this.appendhtml(Templates.inboxcontainer);
				
				// Pageview listeners
				this.listenTo(RootView, "resize", this.resize);

				
				return this;
			},
			
			resize : function(height)
			{
				this.$el.find("#widgetcontainer").height(height -140);
			},
			
			finish : function()
			{
				
				this.resize(RootView.height());
				
				// Add scroller for message
				$message = this.$el.find(".inbox-container").wrap("<div class='scroller'>");
				
				$message.parent().slimScroll({height: "inherit"});
			},

			translateString : function(translatedata)
			{	
				// Translate String
				return Cloudwalkers.Session.polyglot.t(translatedata);
			}
			
		});

		return Inbox;
	}
);