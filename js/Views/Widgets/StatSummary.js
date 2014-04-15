Cloudwalkers.Views.Widgets.StatSummary = Cloudwalkers.Views.Widgets.Widget.extend ({

	'className' : 'stats-summary',
	
	'columns' :  {
		"contacts" : {"title": "Total contacts", "func": "parsecontacts"},
		"score-trending" : {"title": "Popularity score", "func": "parsescore"},
		"outgoing" : {"title": "Messages sent", "func": "parsesent"},
		"coworkers" : {"title": "Co-workers activity", "func": "parseactivity"}
	},
	
	'initialize' : function(options)
	{
		if (options) $.extend(this, options);
		
		// Which collection to focus on
		this.collection = this.model.statistics;

		this.listenTo(this.collection, 'ready', this.fill);
		
	},
	
	'render' : function ()
	{
		// Parameters
		var params = {columns: []};
		
		for (n in this.columnviews)
		{			
			params.columns.push(this.columns[this.columnviews[n]]);
		}

		// Build view
		this.$el.html (Mustache.render (Templates.statsummary, params));

		return this;
	},
	
	'fill' : function()
	{
		
		this.$el.find("[data-type]").each(function(i, el){
			
			var func = $(el).data("type");
			
			$(el).find(".stats-summary-counter").html(this[func]().counter);
			
		}.bind(this));
	},
	
	/**
	 *	Column data
	 **/
	 
	'parsecontacts' : function ()
	{
		// Get most recent stat
		var stat = this.collection.latest();
		
		return { counter: stat.pluck("contacts")};
	},
	
	'parsescore' : function ()
	{
		return { counter: 0};
	},
	
	'parsesent' : function ()
	{
		// Get most recent stat
		var stat = this.collection.latest();
		
		return { counter: stat.pluck("messages")};
	},
	
	'parseactivity' : function ()
	{
		return { counter: 0};
	}
});