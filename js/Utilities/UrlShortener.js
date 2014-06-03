Cloudwalkers.UrlShortener = Backbone.Model.extend({

	'initialize' : function() {
		
		/*// Create local Ping
		if(!Store.exists("ping", {id: this.id})) Store.post("ping", {id: this.id});
		
		this.setCursor(false);
		
		this.fetch({success: this.schedule.bind(this), error: this.toing});
		
		this.on("change:paging", this.setCursor, this);
		this.on("change:updates", this.updateModels, this);
		this.on("change:add", this.addModels, this);
		this.on("change:remove", this.removeModels, this);
		
		// Function triggers (shortcuts)
		this.listenTo(Cloudwalkers.Session, 'ping', this.forceping);*/
	},
	
	'url' : function()
	{
		return 'http://devapi.cloudwalkers.be/urlshortener/shorten?' + $.param (this.parameters);
	},
	
	'parse' : function(response) {
		
		return response;
	},
	
	'sync' : function (method, model, options)
	{
		this.longurl = options.q;
		this.parameters = {'url': this.longurl};
		
		return Backbone.sync(method, model, options);
	}
});