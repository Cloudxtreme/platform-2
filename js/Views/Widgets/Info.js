Cloudwalkers.Views.Widgets.Info = Backbone.View.extend({
	
	'title' : "Info",
	'columns' :  {
		"contact-evolution" : "parseevolution",
		"post-activity" : "parsepostactivity",
		"activity" : "parseactivity",
		"page-views" : "parseviews",

		"contact-evolution-network" : "parseevolutionnetwork",
		"post-activity-network" : "parsepostactivitynetwork",
		"activity-network" : "parseactivitynetwork",
		"page-views-network" : "parseviewsnetwork"

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

		var description = "new contacts"
		this.settings.network = {icon : "group"};

		return [{content: total, descr : description}];
	},

	'parsepostactivity' : function(){

		// Get most recent stat
		var statl = this.collection.latest().pluck("messages");
		var statf = this.collection.first().pluck("messages");
		var total = statl - statf;

		var description = "new messages"
		this.settings.network = {icon : "cloud-upload"};

		return [{content: total, descr : description}];
	},

	'parseactivity' : function(){

		// Get most recent stat
		var statl = this.collection.latest().pluck("activities");
		var statf = this.collection.first().pluck("activities");
		var total = statl - statf;

		var description = "new activities"
		this.settings.network = {icon : "cloud-download"};

		return [{content: total, descr : description}];
	},

	'parseviews' : function(){

		// Get most recent stat
		var statl = this.collection.latest().pluck(["messages","impressions"], false, true);
		var statf = this.collection.first().pluck(["messages","impressions"], false, true);
		var total = statl - statf;

		var description = "new impressions"

		return [{content: total, descr : description}];
	},

	////////////////////////
	//Demo stuff starts here
	'parseevolutionnetwork' : function(){
		
		// Get most recent stat
		var statl = this.collection.latest().pluck("contacts", this.network);
		var statf = this.collection.first().pluck("contacts", this.network);
		var total = statl - statf;

		var description = this.title;

		return [{content: total, descr : description}];
	},

	'parsepostactivitynetwork' : function(){

		// Get most recent stat
		var statl = this.collection.latest().pluck("messages", this.network);
		var statf = this.collection.first().pluck("messages", this.network);
		var total = statl - statf;

		var description = "new messages"

		return [{content: total, descr : description}];
	},

	'parseactivitynetwork' : function(){

		// Get most recent stat
		var statl = this.collection.latest().pluck("activities", this.network);
		var statf = this.collection.first().pluck("activities", this.network);
		var total = statl - statf;

		var description = "new activities"

		return [{content: total, descr : description}];
	},

	'parseviewsnetwork' : function(){

		// Get most recent stat
		var statl = this.collection.latest().pluck(["messages","impressions"], this.network, true);
		var statf = this.collection.first().pluck(["messages","impressions"], this.network, true);
		var total = statl - statf;

		var description = "new impressions"

		return [{content: total, descr : description}];
	},

	'negotiateFunctionalities' : function()
	{
		
	}
});