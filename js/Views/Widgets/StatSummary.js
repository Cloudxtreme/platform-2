Cloudwalkers.Views.Widgets.StatSummary = Cloudwalkers.Views.Widgets.Widget.extend ({

	'className' : 'stats-summary',
	
	'columns' :  {
		"contacts" : {'translate_title': 'total_contacts', "func": "parsecontacts"},
		"score-trending" : {"translate_title": "popularity_score", "func": "parsescore"},
		"outgoing" : {"translate_title": "messages_sent", "func": "parsesent"},
		"coworkers" : {"translate_title": "co-workers_activity", "func": "parseactivity"},

		"contacts-network" : {"translate_title": "total_contacts", "func": "parsecontactsnetwork"},
		"score-trending-network" : {"translate_title": "popularity_score", "func": "parsescorenetwork"},
		"outgoing-network" : {"translate_title": "messages_sent", "func": "parsesentnetwork"},
		"coworkers" : {"translate_title": "co-workers_activity", "func": "parseactivity"},

		"besttime" : {"translate_title": "best_time_to_post", "func": "parsebesttime"}
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

		for (n in params.columns)
		{	
			if((!params.columns[n].title) && (params.columns[n].translate_title))
				params.columns[n].title = this.translateString(params.columns[n].translate_title)

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

		if(stream.length)
			var messages = _.isNumber(stream[0].messages) ? stream[0].messages : stream[0]["messages"];
		else
			messages = 0

		return messages;
	},


	// *** Network specific plucks ***

	'parsecontactsnetwork' : function ()
	{	
		// Get most recent stat
		var stat = this.collection.latest();
		return { counter: stat.pluck("contacts", this.network)};
	},
	
	'parsescorenetwork' : function ()
	{
	
		stat = this.collection.latest();
		var total = stat.pluck("notifications", this.network) + stat.pluck("activities", this.network);
		
		return 	{counter: total};
	},
	
	'parsesentnetwork' : function ()
	{
		// Get most recent stat
		var statl = this.collection.latest();
		var statf = this.collection.first();
		
		var total = statl.pluck("messages", this.network) - statf.pluck("messages", this.network);
		return { counter: total };
	},

	'parsebesttime' : function(){

		var besttimes = this.collection.clone().parsebesttime();

	    if (besttimes.length == 0)
	        return null;
	    
	    var modeMap = {},
	        maxEl = besttimes[0].time,
	        maxCount = 1;

	    for(var i = 0; i < besttimes.length; i++)
	    {	
	        var el = besttimes[i].time;
	        if(el < 0)	continue;

	        if (modeMap[el] == null)
	            modeMap[el] = 1;
	        else
	            modeMap[el]++;

	        if (modeMap[el] > maxCount)
	        {
	            maxEl = el;
	            maxCount = modeMap[el];
	        }
	        else if (modeMap[el] == maxCount)
	        {
	            maxEl = el;
	            maxCount = modeMap[el];
	        }
	    }
	    
	    return {counter : maxEl+"h" };
	},

	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	}

});