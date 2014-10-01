define(
	['backbone', 'Views/Root', 'Session', 'Models/Note', 'Models/Message'],
	function (Backbone, RootView, Session, NoteModel, MessageModel)
	{
		var SimpleCompose = Backbone.View.extend({

			// This view defaults to note

			template : 'composenote', // Can be overriden

			events : {
				'click #post' : 'post',
				'click #cancel' : 'cancel'
			},

			initialize : function(options)
			{	
				// Parameters
				if(options) $.extend(this, options);

				if(!this.model)	this.model = new NoteModel();

				if(this.parent)
					this.model.parent = this.parent;
			},

			render : function()
			{	
				// Add default text
				var params = {};
				var view;

				if(this.model.get("text"))	params.text = this.model.get("text");

				//Mustache Translate Header
				this.mustacheTranslateRender(params);

				view = Mustache.render(Templates[this.template], params);
				this.$el.html (view);

				if(this.model.get("text"))	//we are editing
					this.$el.find('h3').remove();

				// Inject custom loadercontainer
				if(!this.$loadercontainer)
					this.$loadercontainer = this.$el.find ('.modal-footer');

				this.loadListeners(this.model, ['request', 'sync']);

				this.trigger("rendered");

				return this;	
			},

			post : function()
			{	
				var text = this.$el.find('textarea').val();
				var typestring = this.model.typestring;

				if(typestring)	this['post'+typestring](text);
			},

			postnotes : function(text)
			{	
				this.model.save({'text': text}, {patch: this.model.id? true: false, success: this.thanks? this.thankyou.bind(this): this.saved.bind(this)});
			},

			postmessages : function(text)
			{
				var content = {'html' : text, 'plaintext' : text};
				this.model.set('body', content);

				this.model.save({'body': this.model.get('body'), status:'draft'}, {success: this.thanks? this.thankyou.bind(this): this.trigger.bind(this,'save:success')});
			},

			cancel : function()
			{	
				this.trigger('edit:cancel');
				if(!this.persistent){
					this.$el.find('button.close').click();
					this.remove();
				}		
			},

			saved : function()
			{	
				setTimeout(function(){
					this.trigger('save:success');
				}.bind(this), 200)
			},

			thankyou : function()
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
								this.model = new MessageModel();
							} else {
								this.model = new NoteModel();
							}
								
							this.render();
						}.bind(this), 2000);
					}

				}.bind(this),200);	

				// Trigger to update #notes view
				RootView.trigger("added:note", this.model);			
			},

			clean : function()
			{
				this.$el.find('textarea').val('');
			},

			translateString : function(translatedata)
			{	
				// Translate String
				return Session.polyglot.t(translatedata);
			},

			mustacheTranslateRender : function(translatelocation)
			{
				// Translate array
				this.original  = [
					"write_note",
					"save",
					"cancel",
					"private_note"
				];

				this.translated = [];

				for(k in this.original)
				{
					this.translated[k] = this.translateString(this.original[k]);
					translatelocation["translate_" + this.original[k]] = this.translated[k];
				}
			}

		});

		return SimpleCompose;
	}
);