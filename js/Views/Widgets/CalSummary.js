Cloudwalkers.Views.Widgets.CalSummary = Cloudwalkers.Views.Widgets.Widget.extend ({

	'className' : 'stats-summary cal-summary',
	
	'columns' :  [
		{"title": "Total messages", "func": "parsetotal"},
		{"title": "Average", "func": "parseavg"},
		{"title": "Media", "func": "parsemedia"}
		/*{"title": "Trending post", "func": "parsetrending"}*/
	],
	
	'initialize' : function(options)
	{
		if (options) $.extend(this, options);
		
		this.listenTo(this.calview.model.messages, "ready", this.fill);
		
		// Which collection to focus on
		//this.collection = this.model.statistics;

		//this.listenTo(this.collection, 'ready', this.fill);
		
	},
	
	'render' : function ()
	{
		// Parameters
		var params = {columns: this.columns};
		/*
		for (n in this.columnviews)
		{			
			params.columns.push(this.columns[this.columnviews[n]]);
		}*/

		// Build view
		this.$el.html (Mustache.render (Templates.statsummary, params));
		
		return this;
	},
	
	'fill' : function(collection)
	{
		
		this.$el.find("[data-type]").each(function(i, el){
			
			var func = $(el).data("type");
			var results = this[func](collection);
			
			$(el).find(".stats-summary-counter").html(results.counter);
			
			if (results.title)
				$(el).find(".stats-summary-title").html(results.title);
			
		}.bind(this));
	},
	
	/**
	 *	Column data
	 **/
	 
	'parsetotal' : function (collection)
	{
		// Get most recent stat
		//var stat = this.collection.latest();
		
		return { counter: collection.length};//stat.pluck("contacts")};
	},
	
	'parseavg' : function (collection)
	{
		// Prevent divide by zero
		if(!collection.length) return {counter: 0};
		
		var stats = this.calview.viewtype == "agendaWeek"?
			{title: "Daily average", divide: 7}:
			{title: "Weekly average", divide: 4}
		
		var avg = Math.round(collection.length / stats.divide);
			
		stats.counter = avg + " <small>message" + (avg!=1? "s": "") + "</small>";
		
		return stats;
	},
	
	'parsemedia' : function (collection)
	{
		// Prevent divide by zero
		if(!collection.length) return {counter: 0};
		
		var stats = [];
		var total = collection.length;
		var counters = {image: 0, video: 0, link: 0, text: 0};
		
		collection.each(function(model)
		{
			var attached = model.get("attachments");
			
			if(attached) for (n in attached) counters[attached[n].type] ++;
			else counters.text ++;  
		});
		
		if(counters.image)	stats.push("<div class='media-entry'><i class='icon-picture'></i> <strong>" + Math.round(counters.image/total*100) + "</strong>% images</div>"); 
		if(counters.video)	stats.push("<div class='media-entry'><i class='icon-facetime-video'></i> <strong>" + Math.round(counters.video/total*100) + "</strong>% video</div>"); 
		if(counters.link)	stats.push("<div class='media-entry'><i class='icon-link'></i> <strong>" + Math.round(counters.link/total*100) + "</strong>% links</div>");
		if(counters.text)	stats.push("<div class='media-entry'><i class='icon-reorder'></i> <strong>" + Math.round(counters.text/total*100) + "</strong>% text-only</div>");
		
		
		return { counter: stats.join("<br>") };//stat.pluck("messages")};
	},
	
	'parsetrending' : function (collection)
	{
		// Highest engagement
		var trending = collection.max(function(model){ return model.get("engagement"); });
		
		// Shorten plaintext
		var params = {intro: trending.get("body").plaintext.substr(0, 140)};
		if(params.intro.length == 140) params.intro += "...";
		
		$.extend(params, trending.attributes);
		
		// Parse
		return { counter: Mustache.render (Templates.caltrendingentry, params)};
	}
});