Cloudwalkers.Models.Channel = Backbone.Model.extend({

	'initialize' : function ()
	{
		this.messages = new Cloudwalkers.Collections.Messages([], {id: this.id});
		

		// add child channels and streams to collection
		Cloudwalkers.Session.setChannels(this.get("channels"));
		Cloudwalkers.Session.setStreams(this.get("streams"));
		
		
		//this.on("change:streams", function(){ Cloudwalkers.Session.setStreams(this.get("streams")) });
		
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
			
			if(!streams.length) return null;
			
			var id = streams.shift().id;
		}
		 
		return Cloudwalkers.Session.getStream((id)? id: identifier);

	 }
	 

});