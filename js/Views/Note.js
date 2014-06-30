Cloudwalkers.Views.Note = Backbone.View.extend({

	'id' : "compose",
	'className' : "modal hide note",

	'initialize' : function(options)
	{	
		// Parameters
		if(options) $.extend(this);

	},

	'render' : function()
	{	
		var view = Mustache.render(Templates[this.template]);
		this.$el.html (view);

		return this;	
	},



});