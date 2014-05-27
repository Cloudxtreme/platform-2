Cloudwalkers.Views.Widgets.TitleSeparator = Backbone.View.extend({

	'initialize' : function (options)
	{
		if(options) $.extend(this, options);
		
		this.settings = {};
		this.settings.title = this.title;
	},

	'render' : function ()
	{	
		this.$el.html (Mustache.render (Templates.titleseparator, this.settings));	

		return this;
	},

	'negotiateFunctionalities' : function()
	{

	}
	
});