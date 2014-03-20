/* ! Deprecated */
Cloudwalkers.Collections.Comments = Cloudwalkers.Collections.Messages.extend({

	'model' : Cloudwalkers.Models.Comment,
	'parameters' : { records: 20 },
	
	'initialize' : function()//(list, options)
	{
		if( Cloudwalkers.Session.user.account)
			Cloudwalkers.Session.getComments().listenTo(this, "add", Cloudwalkers.Session.getComments().distantAdd)
	},
	
	'url' : function()
	{
		var id = this.parentid;
		
		return CONFIG_BASE_URL + "json/message/" + id + "?" + $.param (this.parameters);
	},
	
	'parse' : function (response)
	{
		if(response.message) return response.message.children;
	}

});
