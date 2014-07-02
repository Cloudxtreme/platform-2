Cloudwalkers.Views.ComposeNote = Backbone.View.extend({

	'template' : 'composenote', // Can be overriden

	'events' : {
		'click #post' : 'post'
	},

	'initialize' : function(options)
	{	
		// Parameters
		if(options) $.extend(this, options);

		// Empty note
		if(!this.note)	this.note = new Cloudwalkers.Models.Note();

		if(this.model)
			this.note.parent = this.model;

	},

	'render' : function()
	{	
		// Add default text
		var params = {};
		var view;

		if(this.note.get("text"))	params.text = this.note.get("text");

		view = Mustache.render(Templates[this.template], params);
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
		var notetext = this.$el.find('textarea').val();

		this.note.save({'text': notetext}, {patch: this.note.id? true: false, success: this.thanks? this.thankyou.bind(this): null});
	},

	'thankyou' : function()
	{
		var thanks = Mustache.render(Templates.thankyou);

		setTimeout(function()
		{
			// Animate compose view
			this.$el.addClass('thanks');

			// Add preview view to Compose
			this.$el.find('section').html(thanks);
			setTimeout(function(){ this.$el.modal('hide'); }.bind(this), 1000);
		}.bind(this),200);				
	},

});