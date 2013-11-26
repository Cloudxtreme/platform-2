Cloudwalkers.Models.Stream = Backbone.Model.extend({

	'initialize' : function(){
		
		// Has reports?
		if(this.get("statistics"))
		{
			this.reports = new Cloudwalkers.Collections.Reports();
			this.reports.streamid = this.id;
		}
	},

});