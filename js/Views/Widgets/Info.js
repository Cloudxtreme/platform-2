Cloudwalkers.Views.Widgets.Info = Backbone.View.extend({
	
	'title' : "Info",
	'columns' :  {
		"contact-evolution" : "parseevolution",
		"post-activity" : "parsepostactivity",
		"activity" : "parseactivity",
		"page-views" : "parseviews"
	},
	
	'initialize' : function (options)
	{	
		if(options) $.extend(this, options);

		this.settings = {
			title	: this.title,
			network : {icon : "cloud"}	
		};

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
		var statl = this.collection.latest().pluck("contacts", "mobile-phone");
		var statf = this.collection.first().pluck("contacts", "mobile-phone");
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

	'negotiateFunctionalities' : function()
	{
		
	}
});