define(
	['Views/Panels/EntryLists/BoxLists/InboxMessageList',  'Models/Message', 'Views/Entries/InboxMessage'],
	function (InboxMessageList, Message, InboxMessageWidget)
	{
		var InboxNotificationListWidget = InboxMessageList.extend({
			
			collectionstring : "notifications",
			check : "hasNotifications",
					
			toggle : function(view)
			{
				if (this.inboxmessage) this.inboxmessage.remove();

				// Get message
				if(view.model.get("parent")) this.showmessage(view.model)
				else this.listenToOnce(view.model, "change", this.showmessage)
						
				this.$el.find(".list .active").removeClass("active");
				view.$el.addClass("active").removeClass("unread");
			},
			
			showmessage : function(model)
			{
				// Load message
				var message = Cloudwalkers.Session.getMessage(model.get("parent").id);
				if(!message) message = new Message({id: model.get("parent").id});
				
				this.model.messages.add(message);
				
				if(!message.get("objectType"))
					message.fetch();

				this.inboxmessage = new InboxMessageWidget({model: message, notification: model});
				
				$(".inbox-container").html(this.inboxmessage.render().el);

			}
		});

		return InboxNotificationListWidget;
	}
);