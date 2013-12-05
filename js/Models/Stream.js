Cloudwalkers.Models.Stream = Backbone.Model.extend({

	'initialize' : function(){
		
		/*if(this.get("incoming"))
		{
			this.messages = new Cloudwalkers.Collections.Messages([], {id: this.id, endpoint: "stream"});
		}*/
		
		this.messages = new Cloudwalkers.Collections.Messages([], {id: this.id, endpoint: "stream"});
		
		// Has reports?
		if(this.get("statistics"))
		{
			this.reports = new Cloudwalkers.Collections.Reports();
			this.reports.streamid = this.id;
		}

	},
	
	'parse' : function(response)
	{
		Store.updateById("streams", response, function(exists, stream)
		{
			if(!exists) Store.post("streams", stream);
		});
		
		return response;
	}

});