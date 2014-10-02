define(
	['backbone', 'Models/Trigger', 'Views/Root'],
	function (Backbone, Trigger, RootView)
	{
		var Trigger = Backbone.View.extend({

			'events' : {
				'click [data-action=save]' : 'save',

				'keyup textarea' : 'enablereset',
				'click [type=reset]' : 'reset'
			},
			
			'initialize' : function(options)
			{
				$.extend(this, options);

				if(!this.model)	this.model = new Trigger();
			},

			'render' : function()
			{	
				this.model.parent = Session.getAccount();
				
				var params = {
					message: this.model.getmessage('REPLY'),
					description: this.description
				}

				//Mustache Translate Render
				this.mustacheTranslateRender(params);

				this.$el.html(Mustache.render(Templates.settings.trigger, params))
				
				return this;
			},

			'updatetrigger' : function(model)
			{	
				this.model = model;
				this.render();

				this.$el.find('.inner-loading').removeClass('inner-loading');
				this.$el.find('.loading').removeClass('loading');
				this.$el.find('textarea').attr('disable', false);

			},

			'save' : function()
			{	
				this.$el.addClass('loading');
				this.$el.find('.submit-btn button').attr('disabled', true);

				this.model.setaction('REPLY', {message: this.$el.find('textarea').val()});

				//Patch if it's an edit
				this.model.save({
					event: this.model.get('event'),
					//condition: this.model.get('condition') || null,
					actions: this.model.get("actions")
					//streams: this.
				}, {patch: this.model.id? true: false, 
						success: function(){
							RootView.growl(this.translateString("user_profile"), this.translateString("your_profile_settings_are_updated"));

							//remove loading and enable submit button
							this.$el.removeClass('loading');
							this.$el.find('[type=submit]').attr('disabled', false);
						}.bind(this),
						error: function(){
							RootView.growl(this.translateString("user_profile"), this.translateString("there_was_an_error_updating_your_settings"));

							//remove loading & reset buttons
							this.$el.removeClass('loading');
							this.$el.find('[type=submit]').attr('disabled', false);
							this.$el.find('[type=reset]').attr('disabled', false);

						}.bind(this)	
					})
			},

			'enablereset' : function()	{ this.$el.find('[type=reset]').attr('disabled', false);	},

			'reset' : function(e)
			{ 
				$(e.currentTarget).closest('form').get(0).reset();

				this.$el.find('[type=reset]').attr('disabled', true);
			},

			'translateString' : function(translatedata)
			{	
				// Translate String
				return Session.polyglot.t(translatedata);
			},

			'mustacheTranslateRender' : function(translatelocation)
			{
				// Translate array
				this.original  = [
					"save_changes",
					"reset"
				];

				this.translated = [];

				for(k in this.original)
				{
					this.translated[k] = this.translateString(this.original[k]);
					translatelocation["translate_" + this.original[k]] = this.translated[k];
				}
			}
		});

		return Trigger;			
});