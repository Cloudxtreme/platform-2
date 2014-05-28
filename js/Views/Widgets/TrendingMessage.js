Cloudwalkers.Views.Widgets.TrendingMessage = Backbone.View.extend({

	'initialize' : function (options)
	{
		if(options) $.extend(this, options);
		
		this.settings = {};
		this.settings.title = this.title;

		this.collection = new Cloudwalkers.Collections.Messages();
		this.listenTo(this.collection, 'ready', this.fill);

		this.gettoptrending();
	},

	'render' : function ()
	{	
		this.$el.html (Mustache.render (Templates.trendingmsg, this.settings));
		return this;
	},

	'fill' : function(){
		
		//No results
		if(this.collection.length == 0)
			return;
		
		var message = this.collection.models[0];
		var links = message.get("attachments").filter(function(el){ if(el.type == "link") return el; });
		var images = message.get("attachments").filter(function(el){ if(el.type == "image") return el; });

		this.settings.statistics = message.get("statistics");
		this.settings.from = message.get("from")[0].displayname || "";
		this.settings.body = message.get("body").plaintext || "";
		this.settings.icon = message.get("icon") || "";
		this.settings.date = message.get("dateonly") || "";
		//Just one image
		this.settings.image = images[0].url || "";
		this.settings.links = links || [];

		this.render();

	},

	'gettoptrending' : function(){

		this.model = Cloudwalkers.Session.getChannel(10);
		
		this.filters = {
			sort: "engagement",
			since: this.timespan.since,
			records : 1
		};

		this.collection.touch(this.model, this.filters);
	},

	'negotiateFunctionalities' : function()
	{

	}
	
});