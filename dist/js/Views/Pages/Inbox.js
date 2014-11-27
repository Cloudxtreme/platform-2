define(
	['Views/Pages/Pageview', 'mustache', 'Views/Panels/EntryLists/BoxLists/InboxMessageList', 'Views/Panels/EntryLists/BoxLists/InboxNotificationList'],
	function (Pageview, Mustache, InboxMessageList, InboxNotificationList)
	{
		var Inbox = Pageview.extend({

			title : 'Inbox',
			className : "container-fluid",
			id: 'inbox',
			options : {},
			
			initialize : function (options)
			{
				$.extend(this.options, options);

				// Memory cloth
				var settings = Cloudwalkers.Session.viewsettings(this.options.type);
				
				if (settings.streams)
					this.options.filters = {contacts : {string:"", list:[]}, streams : settings.streams};
			},
			
			render : function()
			{
				this.title = this.options.type == 'messages'? 'Messages': 'Notifications';

				// Create pageview
				this.$el.html (Mustache.render (Templates.pageview, {title : this.title}));
				this.$container = this.$el.find("#widgetcontainer").eq(0);
				
				// Dedect childtype
				this.options.channel.childtype = this.options.type.slice(0, -1);
				
				// Add list widget
				var list = this.options.type == "messages"?
					
					new InboxMessageList(this.options):
					new InboxNotificationList(this.options);

				this.list = list;
				
				this.appendWidget(list, [12,12,4,4]);
				this.appendhtml(Templates.inboxcontainer);
				
				// Pageview listeners
				this.listenTo(Cloudwalkers.RootView, "resize", this.resize);

				// Add refresh button
				this.$el.find('.page-title').eq(0).append('<span class="listrefresh loading"></span></h3>');
				
				return this;
			},

			refreshlist : function()
			{
				this.list.trigger('refresh:list');
			},
			
			resize : function(height)
			{
				this.$el.find("#widgetcontainer").height(height -140);
			},
			
			finish : function()
			{
				
				this.resize(Cloudwalkers.RootView.height());
				
				// Add scroller for message
				//$message = this.$el.find(".inbox-container").wrap("<div class='scroller'>");
				
				//$message.parent().slimScroll({height: "inherit"});

				this.$el.find('.scroller').slimScroll({
					height: "inherit"
				});
			}
			
		});

		return Inbox;
	}
);