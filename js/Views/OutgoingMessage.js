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
		var url = 'post/?remove=' + this.model.get ('id');

		if (confirm ('Are you sure you want to remove this message?'))
		{
			// Do the call
			jQuery.ajax
			({
				dataType:"json", 
				type:"get", 
				url: url, 
				success:function(objData)
				{
					alert ('The message is removed.');
				}
			});
		}
	}

});