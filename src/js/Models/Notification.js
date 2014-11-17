define(
	['Models/Message', 'Collections/Actions', 'Collections/Notes'],
	function (Message, Actions, Notes)
	{
		var Notification = Message.extend({ 
			
			initialize : function ()
			{
				if (typeof (this.attributes.parent) != 'undefined')
				{	
					this.set ('parentmodel', new Message (this.attributes.parent));
					this.get ('parentmodel').trigger ('change');
				}
				
				// Actions
				this.actions = new Actions(false, {parent: this});
				this.notes = new Notes(false, {parent: this});

				// MIGRATION -> Do we need this?
				//this.notifications = new Notifications(false, {parent: this});
				
				// Listen to destroy
				// Reload parent message for message counter
				this.once("destroy", function()
				{
					this.collection.parentmodel.fetch();					
				})
			},
			
			parse : function(response)
			{	
				// A new object
				if (typeof response == "number") return {id: response};
				
				else {
				
					// Is it a child message?
					// if (response.message) response = response.message;
					
					// Handle fresh loads
					response = this.filterData(response);
					
					this.stamp(response);
					//this.checkloaded(response);
				}
				
				return response;
			}

		});

		return Notification;
});