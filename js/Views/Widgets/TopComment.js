Cloudwalkers.Views.Widgets.TopComment = Backbone.View.extend({

	'initialize' : function (options)
	{
		if(options) $.extend(this, options);
		
		this.settings = {};
		this.settings.title = this.title;

		this.collection = this.model.statistics;
		this.listenTo(this.collection, 'ready', this.fill);
	},

	'render' : function ()
	{	
		this.$el.html (Mustache.render (Templates.topcomment, this.settings));		
		return this;
	},

	'negotiateFunctionalities' : function()
	{

	}
	
});