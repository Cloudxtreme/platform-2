Cloudwalkers.Session.Ping = Backbone.Model.extend({
	
	'interval' : 30000,	// avg interval: 30 sec
	'min' : 10000,		// min interval: 10 sec
	'max' : 90000,		// max interval: 1,5 min
	'timeout' : 0,
	'cursor' : false,
	
	'parameters' : {},
	
	'initialize' : function() {
		
		// Create local Ping
		if(!Store.exists("ping", {id: this.id})) Store.post("ping", {id: this.id});
		
		this.setCursor(false);
		
		this.fetch({success: this.schedule.bind(this), error: this.toing});
		
		this.on("change:paging", this.setCursor, this);
		this.on("change:updates", this.updates, this);
		this.on("change:add", this.addModels, this);
	},
	
	'setCursor' : function(dynamic, changed)
	{
		if(!dynamic)
			Store.get("ping", {id: this.id}, function(entry) {if(entry) this.cursor = entry.cursor;}.bind(this));
		
		else {

			this.interval += Math.round( .2 * (this.min - this.interval));
			this.cursor = changed.cursors.after;
			
			Store.set("ping", {id: this.id, cursor: this.cursor});
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
		 		 
		 console.log("ping updates callback: ", updates);
	 },
	 
	 /**
	 *	Add [something]	
	 **/
	 'addModels' : function(ping, add)
	 {
		 if(!add.length) return null;
		 
		 console.log("ping add callback: ", add);
	 },

	
	'schedule' : function()
	{
		this.timeout = setTimeout( function()
		{
			this.fetch({success: this.schedule.bind(this), error: this.toing});
			
		}.bind(this), this.timer());
	},
	
	'timer' : function()
	{
		/* Dynamic response density */
		return this.interval += Math.round( .05 * (this.max - this.interval));
	},
	
	'toing' : function()
	{	
		Cloudwalkers.RootView.growl ("Ping", "There is no pong.");
	}
});