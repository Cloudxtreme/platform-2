Cloudwalkers.Views.ComposeNote = Backbone.View.extend({

	'template' : 'note', // Can be overriden

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
	},

	'thankyou' : function()
	{
		var thanks = Mustache.render(Templates.thankyou);

		setTimeout(function()
		{
			// Animate compose view
			this.$el.addClass("switch-mode").addClass('thanks');

			// Add preview view to Compose
			this.$el.find('.switch-container').append(thanks);
			setTimeout(function(){ this.$el.modal('hide'); }.bind(this), 1000);
		}.bind(this),400);
				
	},

});