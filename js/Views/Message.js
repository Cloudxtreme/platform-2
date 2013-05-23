Cloudwalkers.Views.Message = Backbone.View.extend({

	'className' : 'message-view',

	'render' : function ()
	{
		var data = this.model.attributes;

		data.sortedattachments = {};

		// Go trough all attachments and put them in groups
		if (typeof (data.attachments) != 'undefined')
		{
			for (var i = 0; i < data.attachments.length; i ++)
			{
				if (typeof (data.sortedattachments[data.attachments[i].type]) == 'undefined')
				{
					data.sortedattachments[data.attachments[i].type] = [];
				}
				data.sortedattachments[data.attachments[i].type].push(data.attachments[i]);
			}
		}

		$(this.el).html (Mustache.render (Templates.message, data));
		updateTimers ();

		return this;
	}

});