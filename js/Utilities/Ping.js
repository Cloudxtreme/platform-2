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
		this.on("change:updates", this.updateModels, this);
		this.on("change:add", this.addModels, this);
		this.on("change:remove", this.removeModels, this);
		
		// Function triggers (shortcuts)
		this.listenTo(Cloudwalkers.Session, 'ping', this.forceping);
	},
	
	/**
	 * 
	 *
	 *
	**/
	
	'ping' : function()
	{
		this.fetch({success: this.schedule.bind(this), error: this.toing.bind(this)});	
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
	 'updateModels' : function(ping, updates)
	 {
		// Accounts
		if (updates.accounts) Cloudwalkers.Session.getAccounts().updates(updates.accounts);
		
		// Streams
		if (updates.streams) Cloudwalkers.Session.getStreams().updates(updates.streams);
		
		// Messages
		if (updates.messages) Cloudwalkers.Session.getMessages().updates(updates.messages);
		
		// Notifications
		if (updates.notifications) Cloudwalkers.Session.getNotifications().updates(updates.notifications);
		
		// Users
		if (updates.users) Cloudwalkers.Session.getUsers().updates(updates.users);
		
		// Contacts
		if (updates.contacts) Cloudwalkers.Session.getContacts().updates(updates.contacts);
	 },
	 
	 /**
	 *	Add [something]	
	 **/
	 'addModels' : function(ping, add)
	 {
		 if(!add.length) return null;
		 
		 console.log("ping add callback: ", add);
	 },
	 
	 /**
	 *	Remove [something]	
	 **/
	 'removeModels' : function(ping, remove)
	 {
		 if(!remove.length) return null;
		 
		 console.log("ping remove callback: ", remove);
	 },

	 'request' : function()
	 {
		// Remove running schedule
		window.clearTimeout(this.timeout);
		
		// Fetch.
		this.fetch({success: this.schedule.bind(this), error: this.toing.bind(this)});
	 },
	
	'schedule' : function()
	{
		this.timeout = setTimeout( this.ping.bind(this), this.timer());
	},
	
	'forceping' : function ()
	{
		// Prevent double ping
		clearTimeout(this.timeout);
		this.schedule();
		
		this.ping();
	},
	
	'timer' : function()
	{
		/* Dynamic response density */
		return this.interval += Math.round( .05 * (this.max - this.interval));
	},
	
	'toing' : function()
	{	
		Cloudwalkers.RootView.growl ("Ping", "There is no pong.");
		
		// Schedule new Ping, with max allowed interval.
		this.interval = this.max;
		this.schedule();
	}
});