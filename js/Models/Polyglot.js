Cloudwalkers.Models.Polyglot = Backbone.Model.extend({

	'initialize' : function(options)
	{
		if(options) $.extend(this, options);
	},

	'url' : function()
	{
		return CONFIG_BASE_URL + 'locales/' + Cloudwalkers.Session.user.attributes.locale + '.json';
	},

	'parse' : function(data)
	{
		return data;
	}

});