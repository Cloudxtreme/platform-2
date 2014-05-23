Cloudwalkers.Views.Widgets.Legenda = Backbone.View.extend({
	
	'title' : "Info",
	
	'initialize' : function (options)
	{
		if(options) $.extend(this, options);
		
		this.listenTo(this.model, 'change', this.render);
	},

	'render' : function ()
	{
		
		this.$el.html ("<div></div>");

		return this;
	},
	
	'negotiateFunctionalities' : function()
	{
		
	}
});