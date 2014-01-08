Cloudwalkers.Collections.Notifications = Cloudwalkers.Collections.Messages.extend({
	
	'model' : Cloudwalkers.Models.Comment,
	'typestring' : "notifications",
	'modelstring' : "notification",
	
	'initialize' : function()
	{
		// Put "add" listener to global notifications collection
		if( Cloudwalkers.Session.user.account)
			Cloudwalkers.Session.getNotifications().listenTo(this, "add", Cloudwalkers.Session.getNotifications().distantAdd)
	}
});