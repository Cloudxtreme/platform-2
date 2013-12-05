Cloudwalkers.Models.Channel = Backbone.Model.extend({

	'initialize' : function ()
	{
		this.messages = new Cloudwalkers.Collections.Messages([], {id: this.id});
	},
	
	/**
	 *	Get Stream
	 *	Get stream by id (int) or token (string)
	 **/
	'getStream' : function(identifier)
	{
		 
		if(typeof identifier == 'string')
		{
			var identifier = identifier;
			var streams = this.get("streams").filter(function(stream){ return stream.token==identifier});
			
			var id = streams.shift().id;
		}
		 
		return Cloudwalkers.Session.getStream((id)? id: identifier);

	 }
	 

});