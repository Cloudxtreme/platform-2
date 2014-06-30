Cloudwalkers.Models.Note = Backbone.Model.extend({

	'typestring' : 'notes',

	'initialize' : function(options)
	{
		if(options) $.extend(this, options);
	}
});