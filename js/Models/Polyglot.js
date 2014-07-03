Cloudwalkers.Models.Polyglot = Backbone.Model.extend({

	'initialize' : function(options)
	{
		if(options) $.extend(this, options);
	},

	'url' : function()
	{
		var locale = Cloudwalkers.Session.user.attributes.locale || "en_EN";
		return CONFIG_BASE_URL + 'locales/' + locale + '.json';
	},

	'parse' : function(data)
	{
		return data;
	}

});