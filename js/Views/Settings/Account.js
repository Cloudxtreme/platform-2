Cloudwalkers.Views.Settings.Account = Backbone.View.extend({

	'events' : {
		'submit .edit-account' : 'editAccount',
		'click i[data-delete-campaign-id]' : 'deleteCampaign'
	},

	'render' : function ()
	{
		
		var data = Cloudwalkers.Session.getAccount().attributes;

		//Mustache Translate Render
		this.mustacheTranslateRender(data);
		
		this.$el.html (Mustache.render (Templates.settings.account, data));

		return this;
	},
	
	'editAccount' : function (e)
	{
		var account = Cloudwalkers.Session.getAccount ();
		var name = this.$el.find ('[name=name]').val ();
		
		account.save ({name: name}, {patch: true, success: function () { Cloudwalkers.RootView.growl('Account settings', "Your account settings are updated"); }});
	},
	
	'deleteCampaign' : function (e)
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