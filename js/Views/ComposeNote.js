Cloudwalkers.Views.ComposeNote = Backbone.View.extend({

	'template' : 'composenote', // Can be overriden

	'events' : {
		'click #post' : 'post',
		'click #cancel' : 'cancel'
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

		//Mustache Translate Header
		this.mustacheTranslateRender(params);

		view = Mustache.render(Templates[this.template], params);
		this.$el.html (view);

		if(this.note.get("text"))	//we are editing
			this.$el.find('h3').remove();

		// Inject custom loadercontainer
		if(!this.$loadercontainer)
			this.$loadercontainer = this.$el.find ('.modal-footer');

		this.loadListeners(this.note, ['request', 'sync']);

		this.trigger("rendered");

		return this;	
	},

	'post' : function()
	{	
		var notetext = this.$el.find('textarea').val();

		this.note.save({'text': notetext}, {patch: this.note.id? true: false, success: this.thanks? this.thankyou.bind(this): this.trigger.bind(this,'save:success')});
	},

	'cancel' : function()
	{	
		this.trigger('edit:cancel');
		if(!this.persistent){		
			this.$el.find('button.close').click();
			this.remove();

		}
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

		// Trigger to update #notes view
		Cloudwalkers.RootView.trigger("added:note", this.note);			
	},

	'clean' : function()
	{
		this.$el.find('textarea').val('');
	},

	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	},

	'mustacheTranslateRender' : function(translatelocation)
	{
		// Translate array
		this.original  = [
			"write_note",
			"save",
			"cancel"
		];

		this.translated = [];

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}
	}

});