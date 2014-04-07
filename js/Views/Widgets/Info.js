Cloudwalkers.Views.Widgets.Info = Backbone.View.extend({
	
	'title' : "Info",
	
	'initialize' : function (options)
	{
		if(options) $.extend(this, options);
		
		this.listenTo(this.model, 'change', this.render);
	},

	'render' : function ()
	{
		
		this.$el.html (Mustache.render (Templates.dashboardstat, {title: this.title}));

		return this;
	},
	
	'negotiateFunctionalities' : function()
	{
		
	}
});