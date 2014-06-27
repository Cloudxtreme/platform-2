Cloudwalkers.Views.Settings.Account = Backbone.View.extend({

	'events' : {
		'submit .edit-account' : 'editAccount',
		'click i[data-delete-campaign-id]' : 'deleteCampaign'
	},

	'render' : function ()
	{
		
		var data = Cloudwalkers.Session.getAccount().attributes;

		//Mustache translations
		data.translate_campaigns = this.translateString("campaigns");
		data.translate_account_plan = this.translateString("account_plan");
		data.translate_account = this.translateString("account");
		data.translate_name = this.translateString("name");
		data.translate_save_changes = this.translateString("save_changes");
		data.translate_cancel = this.translateString("cancel");
		data.translate_company_name = this.translateString("company_name");
		
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
	}

});