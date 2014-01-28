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
		this.collection = this.model.reports;
		
		//this.listenTo(this.collection, 'sync', this.render);
		this.listenTo(this.collection, 'seed', this.render);
		
	},
	
	'render' : function ()
	{
		// Parameters
		var params = {columns: []};
		
		for (n in this.columnviews)
		{			
			$.extend(this.columns[this.columnviews[n]], this[this.columns[this.columnviews[n]].func]());
			params.columns.push(this.columns[this.columnviews[n]]);
		}

		// Build view
		this.$el.html (Mustache.render (Templates.statsummary, params));

		return this;
	},
	
	/**
	 *	Column data
	 **/
	 
	'parsecontacts' : function ()
	{
		//["numbercomparison/followers_count","",""
		
		
		
		return { counter: 1};
	},
	
	'parsescore' : function ()
	{
		return { counter: 1};
	},
	
	'parsesent' : function ()
	{
		return { counter: 1};
	},
	
	'parseactivity' : function ()
	{
		return { counter: 1};
	},
	
	'fill' : function ()
	{	
		/*var report = this.stream.reports.findWhere({token: this.options.type});
		
		if(!report) return null;
		
		var data = {
			dashboard: this.options.dashboard,
			streamid: this.stream.id,
			network: this.stream.get("network"),
			details: report.getDetails()
		}
		
		this.$el.html (Mustache.render (Templates[this.template], data));
		
		this.trigger ('content:change');*/

	}
});