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
	
	/*'url' : function()
	{	
		return 'http://devapi.cloudwalkers.be/urlshortener/shorten?' + $.param (this.parameters);
	},*/
	
	'parse' : function(response) {
		
		return response;
	},
	
	'sync' : function (method, model, options)
	{
		this.longurl = options.q;
		this.campaign = options.campaign;

		this.parameters = {'url': this.longurl};
		if(this.campaign)	this.parameters.campaign = this.campaign;
		
		return Backbone.sync(method, model, options);
	},

	'url' : function()
	{	
		var url = [CONFIG_BASE_URL + "json/accounts"];
		var account = Cloudwalkers.Session.getAccount();

		if(account){
			url.push(account.id)
			url.push('urlshortener/shorten?')
		}
		
		return url.join("/") + $.param (this.parameters);
	}
});