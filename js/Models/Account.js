Cloudwalkers.Models.Account = Backbone.Model.extend({

	'initialize' : function ()
	{

	},

	'avatar' : function ()
	{
		return this.get ('avatar');
	},

	'channels' : function ()
	{
		var channels = this.get ('channels');
		return channels;
	}

});