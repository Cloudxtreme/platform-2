Cloudwalkers.Views.SimpleCompose = Backbone.View.extend({

	// This view defaults to note

	'template' : 'composenote', // Can be overriden

	'events' : {
		'click #post' : 'post',
		'click #cancel' : 'cancel'
	},

	'initialize' : function(options)
	{	
		// Parameters
		if(options) $.extend(this, options);

		if(!this.model)	this.model = new Cloudwalkers.Models.Note();

		if(this.parent)
			this.model.parent = this.parent;
	},

	'render' : function()
	{	
		// Add default text
		var params = {};
		var view;

		if(this.model.get("text"))	params.text = this.model.get("text");

		view = Mustache.render(Templates[this.template], params);
		this.$el.html (view);

		// Inject custom loadercontainer
		if(!this.$loadercontainer)
			this.$loadercontainer = this.$el.find ('.modal-footer');

		this.loadListeners(this.model, ['request', 'sync']);

		this.trigger("rendered");

		return this;	
	},

	'post' : function()
	{	
		var text = this.$el.find('textarea').val();
		var typestring = this.model.typestring;

		if(typestring)	this['post'+typestring](text);
	},

	'postnotes' : function(text)
	{
		this.model.save({'text': text}, {patch: this.model.id? true: false, success: this.thanks? this.thankyou.bind(this): this.trigger.bind(this,'save:success')});
	},

	'postmessages' : function(text)
	{
		var content = {'html' : text, 'plaintext' : text};
		this.model.set('body', content);

		this.model.save({'body': this.model.get('body'), status:'draft'}, {success: this.thanks? this.thankyou.bind(this): this.trigger.bind(this,'save:success')});
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

			if(this.close){
				setTimeout(function(){
					if(this.type == 'draft'){
						this.model = new Cloudwalkers.Models.Message();
					} else {
						this.model = new Cloudwalkers.Models.Note();
					}
						
					this.render();
				}.bind(this), 2000);
			}

		}.bind(this),200);	

		// Trigger to update #notes view
		Cloudwalkers.RootView.trigger("added:note", this.model);			
	},

	'clean' : function()
	{
		this.$el.find('textarea').val('');
	}

});