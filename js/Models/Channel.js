Cloudwalkers.Models.Channel = Backbone.Model.extend({

	'initialize' : function ()
	{
		this.messages = new Cloudwalkers.Collections.Messages([], {id: this.id});
	}

});