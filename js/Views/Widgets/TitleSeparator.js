Cloudwalkers.Views.Widgets.TitleSeparator = Backbone.View.extend({

	'className' : 'titleseparator',

	'initialize' : function (options)
	{
		if(options) $.extend(this, options);
		
		if(this.parentview.timespan != 'default')
			this.title += ' ' + Cloudwalkers.Session.polyglot.t (this.parentview.timespan);
		
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