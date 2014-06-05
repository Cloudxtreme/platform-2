Cloudwalkers.Views.Widgets.NetworkStatistics = Backbone.View.extend({

		'initialize' : function (options)
	{
		if(options) $.extend(this, options);
		
		this.collection = this.model.statistics;	
		this.listenTo(this.collection, 'ready', this.fill);
	},

	'render' : function ()
	{	
		// Create view
		this.settings = {};
		this.settings.title = this.title;

		this.$el.html ('<div id="netstat"></div>');
		
		return this;
	},

	'fill' : function()
	{	
		if(this.filled)	return true;

		title = "Network evolution chart ("+this.network+")";

		data = {chart: 'LineChart', filterfunc: "allreports", network: this.network, title: title};
		data.model = this.model;

		view = new Cloudwalkers.Views.Widgets.Chart(data).render().el;
		this.$el.find('#netstat').append(view);
		//this.parent.appendWidget(view, 12);

        this.filled = true;	
	},

	'negotiateFunctionalities' : function()
	{

	}
	
});