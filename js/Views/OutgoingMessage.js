Cloudwalkers.Views.OutgoingMessage = Cloudwalkers.Views.Message.extend({

	'template' : 'outgoingmessage',

	'canLoadMore' : true,

	'events' : 
	{
		'click .action.edit' : 'edit',
		'click .action.delete' : 'delete'
	},

	'edit' : function ()
	{
		Cloudwalkers.RootView.editMessage (this.model);
	},

	'delete' : function ()
	{
		alert ('removing message');
	}

});