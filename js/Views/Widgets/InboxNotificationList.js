Cloudwalkers.Views.Widgets.InboxNotificationList = Cloudwalkers.Views.Widgets.InboxMessageList.extend({
	
	'collectionstring' : "notifications",
	'check' : "hasNotifications",
			
	'toggle' : function(view)
	{
		if (this.inboxmessage) this.inboxmessage.remove();

		// Get message
		if(view.model.get("parent")) this.showmessage(view.model)
		else this.listenToOnce(view.model, "change", this.showmessage)
				
		this.$el.find(".list .active").removeClass("active");
		view.$el.addClass("active");
	},
	
	'showmessage' : function(model)
	{
		// Load message
		var message;
		
		console.log("showmessage", model.attributes)
		
		if(model.get("parent"))	message = Cloudwalkers.Session.getMessage(model.get("parent").id);
		else					message = new Cloudwalkers.Models.Message({id: model.get("parent").id});
		
		this.model.messages.add(message);
		
		if(!message.get("objectType"))
			message.fetch();

		this.inboxmessage = new Cloudwalkers.Views.Widgets.InboxMessage({model: message, notification: model});
		
		$(".inbox-container").html(this.inboxmessage.render().el);

	}
});