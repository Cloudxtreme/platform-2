Cloudwalkers.Views.Settings.Account = Backbone.View.extend({

	'events' : {
		'click i[data-delete-campaign-id]' : 'deletecampaign',
		'click #menu a' : 'scroll',
		'submit form#editaccount' : 'editaccount',

		'keydown [data-attribute=account-name]' : 'enablebtnaccount',
		'click [data-action=reseetaccount]' : 'disablebtnaccount'
	},

	'initialize' : function()
	{
		this.streams = Cloudwalkers.Session.getStreams();
		this.streams = this.streams.filterNetworks();

		this.account = Cloudwalkers.Session.getAccount();
		this.triggers = new Cloudwalkers.Collections.Triggers();

		//this.listenTo(this.triggers, 'sync', this.filltriggers);

		this.account = Cloudwalkers.Session.getAccount();
		
		this.triggermodel = {};
	},

	'render' : function ()
	{		
		var data = this.account.attributes;
		
		//Mustache Translate Render
		this.mustacheTranslateRender(data);

		// Apply role permissions to template data
		Cloudwalkers.Session.censuretemplate(data);
	
		this.$el.html (Mustache.render (Templates.settings.account, data));

		this.$el.find("#menu").affix()

		//Canned responses list
		//var cannedlist = new Cloudwalkers.Views.Settings.CannedList();
		//this.$el.find("#cannedlist").append(cannedlist.render().el);
	
		// Render manually both trigger's views
		this.twitterview = new Cloudwalkers.Views.Settings.Trigger({event: 'CONTACT-NEW', stream: 'twitter', description: 'Twitter: New follower response'});
		this.dmview = new Cloudwalkers.Views.Settings.Trigger({event: 'MESSAGE-RECEIVED',  description: 'DM: Out of office response'});

		this.$el.find("#triggerlist").append(this.twitterview.render().el);
		this.$el.find("#triggerlist").append(this.dmview.render().el);

		this.triggers.parent = this.account;
		this.triggers.fetch();

		return this;
	},

	'enablebtnaccount' : function()	{ this.$el.find('[data-action=reseetaccount]').attr('disabled', false);	},

	'disablebtnaccount' : function(e)
	{ 
		$(e.currentTarget).closest('form').get(0).reset();

		this.$el.find('[data-action=reseetaccount]').attr('disabled', true);
	},
	

	'filltriggers' : function(models)
	{	console.log(models)
		//Hack time!
		var twitterfollow = models.filter(function(el){ if(el.get("event") == 'CONTACT-NEW') return el;})
		var dmout = models.filter(function(el){ if(el.get("event") == 'MESSAGE-RECEIVED') return el;})
		
		twitterfollow = new Cloudwalkers.Models.Trigger(twitterfollow[0].attributes);
		this.twitterview.updatetrigger(twitterfollow);
		
		dmout = new Cloudwalkers.Models.Trigger(dmout[0].attributes);
		this.dmview.updatetrigger(dmout);
	},

	'action' : function(e)
	{
		// Action token
		var token = $(e.currentTarget).data ('action');

		this[token](e);
	},
	
	'editaccount' : function (e)
	{
		var name = this.$el.find ('[data-attribute=account-name]').val ();

		this.$el.find(".edit-account-name").addClass('loading');
		this.$el.find('.edit-account-name .btn').attr('disabled', true);
		
		this.account.save ({name: name}, {patch: true, success: function ()
			{
				Cloudwalkers.RootView.growl(this.translateString("account_settings"), this.translateString("your_account_settings_are_updated"));
				
				//Reenable submit button & remove loading
				this.$el.find(".edit-account-name").removeClass('loading');
				this.$el.find('[data-action=editaccount]').attr('disabled', false);

			}.bind(this),
			error: function(){
				Cloudwalkers.RootView.growl(this.translateString("account_settings"), this.translateString("there_was_an_error_updating_your_settings"));
				
				//Reaneable buttons & remove loading
				this.$el.find(".edit-account-name").removeClass('loading');
				this.$el.find('[data-action=editaccount]').attr('disabled', false);
				this.$el.find('[data-action=editaccount]').attr('disabled', false);

			}.bind(this)});
	},
	
	'deletecampaign' : function (e)
	{
		//var account = Cloudwalkers.Session.getAccount();
		var campaignid = $(e.target).data ('delete-campaign-id'); //= account.campaigns.get( $(e.target).data ('delete-campaign-id'));
		
		Cloudwalkers.RootView.confirm 
		(
			this.translateString('are_you_sure_you_want_to_remove_this_campaign'), 
			function () 
			{
				Cloudwalkers.Session.getAccount().removecampaign(campaignid, e.target);
			}
		)
	},

	'scroll' : function(e)
	{	
		var hash = $(e.currentTarget).data('hash');		
		var position = this.$el.find('h3[name='+hash+']').offset().top;
		position = position - this.$el.find('h3[name='+hash+']').outerHeight();
		
		$('html, body').animate({scrollTop:position}, 'fast');

		return false;
	},

	/* on it's way to be deprecated */
	'negotiateFunctionalities' : function(el) {
		
		// Check collapse option
		this.$el.find('.portlet-title').on('click', function(){ $(this).parents(".collapse-closed, .collapse-open").toggleClass("collapse-closed collapse-open"); });
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
			"campaigns",
			"account_plan",
			"account",
			"name",
			"save_changes",
			"cancel",
			"company_name",
			"menu",
			"campaigns",
			"basic",
			"manage_campaigns",
			"manage_auto_responders",
			"message_templates",
			"triggers"
		];

		this.translated = [];

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}
	}

});