Cloudwalkers.Collections.Channels = Backbone.Collection.extend({

	'model' : Cloudwalkers.Models.Channel,
	
	'url' : function()
	{
		return CONFIG_BASE_URL + 'json/account/' + Cloudwalkers.Session.getAccount ().id + '/channels';
	},
	
	// Add channels child streams to collection
	// used for first load only
	'collectStreams' : function ()
	{
		this.each(function(channel)
		{
			Cloudwalkers.Session.getStreams().add(channel.streams);
		});
	}
});