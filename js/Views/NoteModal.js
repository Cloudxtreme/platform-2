Cloudwalkers.Views.NoteModal = Backbone.View.extend({

	'id' : "compose",
	'className' : "modal hide note",

	'initialize' : function(options)
	{
		// Parameters
		if(options) $.extend(this);

	},

	'render' : function()
	{	

		var view = Mustache.render(Templates.notemodal);
		this.$el.html (view);

		return this;	
	},



});