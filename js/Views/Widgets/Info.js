Cloudwalkers.Views.Widgets.Info = Backbone.View.extend({
	
	'title' : "Info",
	'columns' :  {
		"contact-evolution" : "parseevolution",
		"post-activity" : "parsepostactivity",
		"activity" : "parseactivity",
		"page-views" : "parseviews",
		"notifications" : "parsenotifications",

		"contact-evolution-network" : "parseevolutionnetwork",
		"post-activity-network" : "parsepostactivitynetwork",
		"activity-network" : "parseactivitynetwork",
		"page-views-network" : "parseviewsnetwork",
		"besttimetopost" : "parsebesttimetopost",
		"followers" : "parsefollowers",
		"following" : "parsefollowing",
		"mentions" : "parsementions",
		"retweets" : "parseretweets",
		"shares"	: "parseshares",
		"posts"	: "parseposts",
		"dms"	: "parsedms"

	},

	'descriptions' : {
		'contacts' : {
			'facebook' 	: 'New fans',
			'twitter'	: 'New followers',
			'youtube' 	: 'New subscriptions',
			'linkedin'	: 'New followers'
		},
		'messages' : {
			'facebook' 	: 'New mesages',
			'twitter'	: 'New tweets',
			'youtube' 	: 'New uploads',
			'linkedin'	: 'New messages'
		},
		'notifications' : {
			'facebook' 	: 'New notifications',
			'twitter'	: 'New notifications',
			'youtube' 	: 'New notifications',
			'linkedin'	: 'New notifications'
		}
	},

	'streamid' : null,
	
	'initialize' : function (options)
	{	
		if(options) $.extend(this, options);

		if(!this.network && this.parentview)
			this.network = this.parentview.streamid;

		this.settings = {
			title	: this.title,
			network : this.network? {icon: Cloudwalkers.Session.getStream(this.network).get("network").token}: {icon : "cloud"},
			streamid: this.network
		};
		
		this.settings.filterfunc = this.filterfunc;
		this.settings.footer = this.footer;

		this.collection = this.parentview.collection;
		
		this.listenTo(this.collection, 'ready', this.fill);
		this.listenTo(this.collection, 'change', this.render);
	},

	'render' : function ()
	{	
		this.$el.html (Mustache.render (Templates.dashboardstat, this.settings));

		if(this.settings.details && this.settings.details.length)
		{	
			if(this.settings.details[0].content !== undefined)
				this.$el.find('.dashboard-stat').removeClass('portlet-loading');
		}

		return this;
	},
	
	'fill' : function(){
		
		var parsetype = this.columns[this.filterfunc];
		this.settings.details = this[parsetype]();

		this.render();
	},

	'parseevolution' : function(){

		// Get most recent stat
		var statl = this.collection.latest().pluck("contacts");
		var statf = this.collection.first().pluck("contacts");
		var total = statl - statf;

		var description = this.translateString("new_contacts")

		this.settings.network = {icon : "group"};

		return [{content: total, descr : description}];
	},

	'parsepostactivity' : function(){

		// Get most recent stat
		var statl = this.collection.latest().pluck("messages");
		var statf = this.collection.first().pluck("messages");
		var total = statl - statf;

		var description = this.translateString("new_messages")

		this.settings.network = {icon : "cloud-upload"};

		return [{content: total, descr : description}];
	},

	'parseactivity' : function(){

		// Get most recent stat
		var statl = this.collection.latest().pluck("activities");
		var statf = this.collection.first().pluck("activities");
		var total = statl - statf;

		var description = this.translateString("new_activities")

		this.settings.network = {icon : "cloud-download"};

		return [{content: total, descr : description}];
	},

	'parseviews' : function(){

		// Get most recent stat
		var statl = this.collection.latest().pluck(["messages","impressions"], false, true);
		var statf = this.collection.first().pluck(["messages","impressions"], false, true);
		var total = statl - statf;

		var description = this.translateString("new_impressions")

		return [{content: total, descr : description}];
	},

	'parsenotifications' : function(){

		// Get most recent stat
		var statl = this.collection.latest().pluck("notifications");
		var statf = this.collection.first().pluck("notifications");
		var total = statl - statf;

		var description = this.translateString("new_notifications")

		return [{content: total, descr : description}];
	},

	////////////////////////
	//Demo stuff starts here
	'parseevolutionnetwork' : function(){
		
		// Get most recent stat
		var statl = this.collection.latest().pluck("contacts", this.network);
		var statf = this.collection.first().pluck("contacts", this.network);
		var total = statl - statf;

		var description = this.descriptions.contacts[this.icon];

		return [{content: total, descr : description}];
	},

	'parsepostactivitynetwork' : function(){

		// Get most recent stat
		var statl = this.collection.latest().pluck("messages", this.network);
		var statf = this.collection.first().pluck("messages", this.network);
		var total = statl - statf;

		var description = this.descriptions.messages[this.icon];

		return [{content: total, descr : description}];
	},

	'parseactivitynetwork' : function(){

		// Get most recent stat
		var statl = this.collection.latest().pluck("activities", this.network);
		var statf = this.collection.first().pluck("activities", this.network);
		var total = statl - statf;

		var description = this.translateString("new_activities")

		return [{content: total, descr : description}];
	},

	'parseviewsnetwork' : function(){

		// Get most recent stat
		var statl = this.collection.latest().pluck(["messages","impressions"], this.network, true);
		var statf = this.collection.first().pluck(["messages","impressions"], this.network, true);
		var total = statl - statf;

		var description = this.translateString("post_views")

		return [{content: total, descr : description}];
	},

	'parsenotificationnetwork' : function(){
		
		// Get most recent stat
		var statl = this.collection.latest().pluck("contacts", this.network);
		var statf = this.collection.first().pluck("contacts", this.network);
		var total = statl - statf;

		var description = this.descriptions.notifications[this.icon];

		return [{content: total, descr : description}];
	},

	'parsefollowers' : function(){

		var statl = this.collection.latest().pluck(["contacts","types","followers"], this.network,3) || 
					this.collection.latest().pluck("contacts", this.network);

		var statf = this.collection.first().pluck(["contacts","types","followers"], this.network,3) ||
					this.collection.first().pluck("contacts", this.network);
		var total = statl - statf;
		var percent = total == 0? 0: Math.floor(total/statf*100);

		if(percent >= 0)	percent = '+' + percent;
		if(total >= 0)		total 	= '+' + total;

		var description = '<strong>'+ total +'</strong> ('+ percent +'%) in last 7 days';
		//console.log(statl-statf, ((statl-statf)/statf)*100, statl, statf)
		return [{content: statl, descr : description}];
	},

	'parsementions' : function(){

		var statl = this.collection.latest().pluck(["notifications","types","comments"], this.network,3);
		var statf = this.collection.first().pluck(["notifications","types","comments"], this.network,3);
		var total = statl - statf;

		var description = this.title;

		return [{content: total, descr : description}];
	},

	'parseretweets' : function(){

		var statl = this.collection.latest().pluck(["notifications","types","shares"], this.network,3);
		var statf = this.collection.first().pluck(["notifications","types","shares"], this.network,3);
		var total = statl - statf;

		var description = this.title;

		return [{content: total, descr : description}];
	},

	'parsefollowing' : function(){

		var statl = this.collection.latest().pluck(["contacts","types","following"], this.network,3);
		var statf = this.collection.first().pluck(["contacts","types","following"], this.network,3);
		var total = statl - statf;

		var description = this.title;

		return [{content: total, descr : description}];
	},

	//GOOGLE PLUS SPECIFIC
	'parseplusones' : function(){

		var statl = this.collection.latest().pluck(["notifications","types","favourites"], this.network,3);
		var statf = this.collection.first().pluck(["notifications","types","favourites"], this.network,3);
		var total = statl - statf;

		var description = this.title;

		return [{content: total, descr : description}];
	},

	//LINKED IN SPECIFIC
	'parseseniorities' : function(){

		var statl = this.collection.latest().pluck(["contacts","professional","seniority"], this.network,3);
		var statf = this.collection.first().pluck(["contacts","professional","seniority"], this.network,3);
		var total = statl - statf;

		var description = this.title;

		return [{content: total, descr : description}];
	},

	'parseshares' : function(){

		var statl = this.collection.latest().pluck(["messages","types","shares"], this.network,3);
		var statf = this.collection.first().pluck(["messages","types","shares"], this.network,3);
		var total = statl - statf;

		var description = this.translateString("new_shares")

		return [{content: total, descr : description}];
	},

	'parseposts' : function(){

		var statl = this.collection.latest().pluck(["messages","types","posts"], this.network,3);
		var statf = this.collection.first().pluck(["messages","types","posts"], this.network,3);
		var total = statl - statf;

		var description = this.translateString("new_posts")

		return [{content: total, descr : description}];
	},

	'parsedms' : function(){

		var statl = this.collection.latest().pluck(["messages","types","dms"], this.network,3);
		var statf = this.collection.first().pluck(["messages","types","dms"], this.network,3);
		var total = statl - statf;

		var description = this.translateString("new_direct_messages")

		return [{content: total, descr : description}];
	},

	'parsebesttimetopost' : function()
	{	
		var besttimes = this.collection.clone().parsebesttime(this.network);

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

	    var description = this.title;
	    
	    if(maxEl >= 0)
	    	return [{content: maxEl+'h - '+ (maxEl+1) +'h', descr : description}];
	    else
	    	return false;
	    
	},

	'negotiateFunctionalities' : function()
	{
		
	},

	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	},
});