Cloudwalkers.Models.Polyglot = Backbone.Model.extend({

	'initialize' : function(options)
	{
		if(options) $.extend(this, options);
	},

	'url' : function()
	{
		return "jsonfilehere";
	}

});