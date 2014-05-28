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
		"followers" : "parsefollowers",
		"following" : "parsefollowing",
		"mentions" : "parsementions",
		"retweets" : "parseretweets",
		"shares"	: "parseshares",
		"posts"	: "parseposts",
		"dms"	: "parsedms",

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
	
	'initialize' : function (options)
	{	
		if(options) $.extend(this, options);

		this.settings = {
			title	: this.title,
			network : this.icon ? {icon: this.icon} : {icon : "cloud"}	
		};

		this.settings.filterfunc = this.filterfunc;
		this.settings.footer = this.footer;

		this.collection = this.model.statistics;
		
		this.listenTo(this.collection, 'ready', this.fill);
		this.listenTo(this.collection, 'change', this.render);

	},

	'render' : function ()
	{	
		this.$el.html (Mustache.render (Templates.dashboardstat, this.settings));

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

		var description = "New contacts"
		this.settings.network = {icon : "group"};

		return [{content: total, descr : description}];
	},

	'parsepostactivity' : function(){

		// Get most recent stat
		var statl = this.collection.latest().pluck("messages");
		var statf = this.collection.first().pluck("messages");
		var total = statl - statf;

		var description = "New messages"
		this.settings.network = {icon : "cloud-upload"};

		return [{content: total, descr : description}];
	},

	'parseactivity' : function(){

		// Get most recent stat
		var statl = this.collection.latest().pluck("activities");
		var statf = this.collection.first().pluck("activities");
		var total = statl - statf;

		var description = "New activities"
		this.settings.network = {icon : "cloud-download"};

		return [{content: total, descr : description}];
	},

	'parseviews' : function(){

		// Get most recent stat
		var statl = this.collection.latest().pluck(["messages","impressions"], false, true);
		var statf = this.collection.first().pluck(["messages","impressions"], false, true);
		var total = statl - statf;

		var description = "New impressions"

		return [{content: total, descr : description}];
	},

	'parsenotifications' : function(){

		// Get most recent stat
		var statl = this.collection.latest().pluck("notifications");
		var statf = this.collection.first().pluck("notifications");
		var total = statl - statf;

		var description = "New notifications"

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

		var description = "New activities"

		return [{content: total, descr : description}];
	},

	'parseviewsnetwork' : function(){

		// Get most recent stat
		var statl = this.collection.latest().pluck(["messages","impressions"], this.network, true);
		var statf = this.collection.first().pluck(["messages","impressions"], this.network, true);
		var total = statl - statf;

		var description = "Post views"

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

		var statl = this.collection.latest().pluck(["contacts","types","followers"], this.network,3);
		var statf = this.collection.first().pluck(["contacts","types","followers"], this.network,3);
		var total = statl - statf;

		var description = this.title;

		return [{content: total, descr : description}];
	},

	//TWITTER SPECIFIC
	'parsefollowers' : function(){

		var statl = this.collection.latest().pluck(["contacts","types","followers"], this.network,3);
		var statf = this.collection.first().pluck(["contacts","types","followers"], this.network,3);
		var total = statl - statf;

		var description = this.title;

		return [{content: total, descr : description}];
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

		var description = this.title;

		return [{content: total, descr : description}];
	},

	'parseposts' : function(){

		var statl = this.collection.latest().pluck(["messages","types","posts"], this.network,3);
		var statf = this.collection.first().pluck(["messages","types","posts"], this.network,3);
		var total = statl - statf;

		var description = this.title;

		return [{content: total, descr : description}];
	},

	'parsedms' : function(){

		var statl = this.collection.latest().pluck(["messages","types","dms"], this.network,3);
		var statf = this.collection.first().pluck(["messages","types","dms"], this.network,3);
		var total = statl - statf;

		var description = this.title;

		return [{content: total, descr : description}];
	},





	'negotiateFunctionalities' : function()
	{
		
	}
});