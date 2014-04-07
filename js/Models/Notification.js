Cloudwalkers.Models.Notification = Cloudwalkers.Models.Message.extend({
	
	'parse' : function(response)
	{	
		// A new object
		if (typeof response == "number") return {id: response};
		
		else {
		
			// Is it a child message?
			// if (response.message) response = response.message;
			
			// Handle fresh loads
			response = this.filterData(response);
			
			this.stamp(response);
			//this.checkloaded(response);
		}
		
		return response;
	}

});