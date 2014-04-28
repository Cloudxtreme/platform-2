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
	
		stat = this.collection.latest();
		var total = stat.pluck("notifications") + stat.pluck("activities");
		
		return 	{counter: total};
	},
	
	'parsesent' : function ()
	{
		// Get most recent stat
		var statl = this.collection.latest();
		var statf = this.collection.first();
		
		var total = statl.pluck("messages") - statf.pluck("messages");
		return { counter: total };
	},
	
	'parseactivity' : function ()
	{

		//$.each(Cloudwalkers.Session.getStreams().models, function(index, model) { console.log(model.id, model.get("token"))});

		// Get most recent stat
		var id = Cloudwalkers.Session.getStream("coworkers").id;
		var total = this.activitymsgs(this.collection.latest(),id) - this.activitymsgs(this.collection.first(),id);
		
		return {counter: total >= 0 ? total : 0};
	},

	'activitymsgs' : function(statistic, id){

		var streams = statistic.get("streams");

		var stream = $.grep(streams, function(s){
		 	return s.id == id; 
		});

		var messages = _.isNumber(stream[0].messages) ? stream[0].messages : stream[0]["messages"];
		return messages;
	}
});