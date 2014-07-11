Cloudwalkers.Views.Settings.Account = Backbone.View.extend({

	'events' : {
		'click *[data-action]' : 'action',
		'click i[data-delete-campaign-id]' : 'deletecampaign'
	},

	'initialize' : function()
	{
		this.streams = Cloudwalkers.Session.getStreams();
		this.streams = this.streams.filterNetworks();
		
		this.triggermodel = {};
	},

	'render' : function ()
	{		
		var data = Cloudwalkers.Session.getAccount().attributes;
		this.account = Cloudwalkers.Session.getAccount ();

		//Mustache Translate Render
		this.mustacheTranslateRender(data);

		// Apply role permissions to template data
		Cloudwalkers.Session.censuretemplate(data);
	
		this.$el.html (Mustache.render (Templates.settings.account, data));

		return this;
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
		
		this.account.save ({name: name}, {patch: true, success: function () { Cloudwalkers.RootView.growl('Account settings', "Your account settings are updated"); }});
	},

	'savetwitterfollow' : function (e)
	{
		this.triggermodel.event = "CONTACT-NEW";
		this.triggermodel.actions = [{action: "REPLY", message: this.$el.find('#twitterfollow').val()}]
		this.triggermodel.streams = this.streams['twitter']? this.streams['twitter'].ids: null;

		var trigger = new Cloudwalkers.Models.Trigger(this.triggermodel);
		trigger.parent = this.account;

		trigger.save();
	},

	'savedmout' : function (e)
	{
		this.triggermodel.event = "MESSAGE-RECEIVED";
		this.triggermodel.actions = [{action: "REPLY", message: this.$el.find('#dmout').val()}]

		var trigger = new Cloudwalkers.Models.Trigger(this.triggermodel);
		trigger.parent = this.account;

		trigger.save();
	},
	
	'deletecampaign' : function (e)
	{
		//var account = Cloudwalkers.Session.getAccount();
		var campaignid = $(e.target).data ('delete-campaign-id'); //= account.campaigns.get( $(e.target).data ('delete-campaign-id'));
		
		Cloudwalkers.Session.getAccount().removecampaign(campaignid);
		
		$(e.target).closest('li').remove();
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
			"company_name"
		];

		this.translated = [];

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}
	}

});