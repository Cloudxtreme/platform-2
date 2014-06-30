Cloudwalkers.Views.ComposeNote = Backbone.View.extend({

	'events' : {
		'click #post' : 'post'
	},

	'initialize' : function(options)
	{	
		// Parameters
		if(options) $.extend(this, options);

		// Empty note
		this.note = new Cloudwalkers.Models.Note();

		if(this.model)
			this.note.parent = this.model;

	},

	'render' : function()
	{	
		var view = Mustache.render(Templates[this.template]);
		this.$el.html (view);

		// Inject custom loadercontainer
		if(!this.$loadercontainer)
			this.$loadercontainer = this.$el.find ('.modal-footer');

		this.loadListeners(this.note, ['request', 'sync'], true);

		this.trigger("rendered");

		return this;	
	},

	'post' : function()
	{			
		var notetext = this.$el.find('#note-content').val();
		this.note.set("text", notetext);

		this.note.save();
	}

});