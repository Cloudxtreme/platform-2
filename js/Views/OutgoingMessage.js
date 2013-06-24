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

	'additionalData' : function (data)
	{
		data.scheduledate = this.model.scheduledate ();

		return data;
	},

	'delete' : function ()
	{
		var self = this;
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
					var collection = self.model.collection;
					collection.reset ();
					collection.fetch ();
				}
			});
		}
	}

});