Cloudwalkers.Views.OutgoingMessage = Cloudwalkers.Views.Message.extend({

	'template' : 'outgoingmessage',

	'events' : 
	{
		'click .action.edit' : 'edit'
	},

	'edit' : function ()
	{
		Cloudwalkers.RootView.editMessage (this.model);
	}

});