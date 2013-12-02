Cloudwalkers.Session.Ping = Backbone.Model.extend({
	
	'interval' : 30,
	'timeout' : 0,
	'cursor' : false,
	
	'parameters' : {
		precision : 2	
	},
	
	'initialize' : function() {
		
		// Create local Ping
		if(!Store.exists("ping", {id: this.id})) Store.post("ping", {id: this.id});
		
		this.setCursor(false);
		
		this.fetch({success: this.schedule.bind(this), error: this.toing});
		
		this.on("change:paging", this.setCursor, this);
		this.on("change:updates", this.updates, this);
	},
	
	'setCursor' : function(dynamic, changed)
	{
		if(!dynamic)
			Store.get("ping", {id: this.id}, function(entry) {if(entry) this.cursor = entry.cursor;}.bind(this));
		
		else {
			this.cursor = changed.cursors.after;
			Store.update("ping", {id: this.id}, {cursor: this.cursor});
		}
	},
	
	'url' : function()
	{
		if(this.cursor) this.parameters.after = this.cursor;
			
		return CONFIG_BASE_URL + 'json/account/' + this.id + '/ping?' + $.param (this.parameters);
	},
	
	'parse' : function(response) {
		
		return response.pong;
	},
	
	/**
	 *	Update [something]	
	 **/
	 'updates' : function(ping, updates)
	 {
		 if(!updates.length) return null;
		 
		 var channels = [];
		 var streams = [];
		 
		 for (n in updates)
		 {
			 channels = channels.concat(updates[n].channels);
			 streams = streams.concat(updates[n].streams);
		 }
		 
		 console.log("ping success callback: ", channels, streams);
	 },
	
	'schedule' : function()
	{
		/* The Schedule function schould be dynamic towards response density */
		
		this.timeout = setTimeout( function()
		{
			this.fetch({success: this.schedule.bind(this), error: this.toing});
			
		}.bind(this), this.interval *1000);
	},
	
	'toing' : function()
	{	
		Cloudwalkers.RootView.growl ("Ping", "There is no pong.");
	}
});