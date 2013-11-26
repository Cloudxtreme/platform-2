Cloudwalkers.Models.Stream = Backbone.Model.extend({

	'initialize' : function(){
		
		// Has reports?
		if(this.get("incoming"))
		{
			//this.messages = new Cloudwalkers.Collections.Messages();
			//this.messages.streamid = this.id;
		}
		
		if(this.get("statistics"))
		{
			this.reports = new Cloudwalkers.Collections.Reports();
			this.reports.streamid = this.id;
		}

	},

});