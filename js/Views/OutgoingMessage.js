Cloudwalkers.Views.OutgoingMessage = Cloudwalkers.Views.Message.extend({

	'template' : 'outgoingmessage',

	'canLoadMore' : true,

	'additionalData' : function (data)
	{
		data.scheduledate = this.model.scheduledate ();

		return data;
	}

});