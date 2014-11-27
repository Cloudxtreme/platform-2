define(
	['backbone', 'Models/Trigger', 'Views/Root'],
	function (Backbone, Trigger, RootView)
	{
		var TriggerView = Backbone.View.extend({

			events : {
				'click [data-action=save]' : 'save',

				'keyup textarea' : 'enablereset',
				'click [type=reset]' : 'reset'
			},
			
			initialize : function(options)
			{
				$.extend(this, options);

				if(!this.model)	this.model = new Trigger();
			},

			render : function()
			{	
				this.model.parent = Cloudwalkers.Session.getAccount();
				
				var params = {
					message: this.model.getmessage('REPLY'),
					description: this.description
				}

				this.$el.html(Mustache.render(Templates.settings.trigger, params))
				
				return this;
			},

			updatetrigger : function(model)
			{	
				this.model = model;
				this.render();

				this.$el.find('.inner-loading').removeClass('inner-loading');
				this.$el.find('.loading').removeClass('loading');
				this.$el.find('textarea').attr('disable', false);

			},

			save : function()
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
							Cloudwalkers.RootView.growl(trans("User Profile"), trans("Your Profile Settings are updated"));

							//remove loading and enable submit button
							this.$el.removeClass('loading');
							this.$el.find('[type=submit]').attr('disabled', false);
						}.bind(this),
						error: function(){
							Cloudwalkers.RootView.growl(trans("User Profile"), trans("There was an error updating your settings."));

							//remove loading & reset buttons
							this.$el.removeClass('loading');
							this.$el.find('[type=submit]').attr('disabled', false);
							this.$el.find('[type=reset]').attr('disabled', false);

						}.bind(this)	
					})
			},

			enablereset : function()	{ this.$el.find('[type=reset]').attr('disabled', false);	},

			reset : function(e)
			{ 
				$(e.currentTarget).closest('form').get(0).reset();

				this.$el.find('[type=reset]').attr('disabled', true);
			}
		});

		return TriggerView;			
});