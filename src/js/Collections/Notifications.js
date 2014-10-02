define(
	['Collections/Messages'],
	function (Messages)
	{
		var Notifications = Messages.extend({
	
			'model' : Cloudwalkers.Models.Notification,
			'typestring' : "notifications",
			'modelstring' : "notification",
			
			'initialize' : function()
			{
				// Put "add" listener to global notifications collection
				if( Session.user.account)
					Session.getNotifications().listenTo(this, "add", Session.getNotifications().distantAdd);
					
				// Destroy listener
				this.on("destroy", this.destroy);

				// Check if it's empty only after sync
				this.on('sync', function(){
					setTimeout(function(){
						this.isempty();
					}.bind(this),1);
				});
			}
		});

		return Notifications
});