Cloudwalkers.Views.RSSFeed = Cloudwalkers.Views.Pageview.extend({
	
	'id' : "rss",
	'parameters': { records: 20, markasread: true },
	'entries' : [],

	'events' : 
	{
		'click .message' : 'openMessage'
	},
	
	'initialize' : function (options)
	{
		if (options) $.extend(this, options);
		
		this.translateTitle("rss_feed");

		this.$el.addClass("loading");
	},
	
	'hideloading': function()
	{
		this.$el.removeClass("loading");
		this.$el.find(".timeline-loading").hide();
	},
	
	'render' : function ()
	{
		var params = {
			'title' : this.title
		}

		//Mustache Translate Render
		this.mustacheTranslateRender(params);

		// Pageview
		this.$el.html (Mustache.render (Templates.rssfeed, params));

		return this;
	},

	'openMessage': function(el)
	{
		$(el).addClass('oppened');
	},

	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	},

	'translateTitle' : function(translatedata)
	{	
		// Translate Title
		this.title = Cloudwalkers.Session.polyglot.t(translatedata);
	},

	'mustacheTranslateRender' : function(translatelocation)
	{
		// Translate array
		this.original  = [
			"loading"
		];

		this.translated = [];

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}
	}


});