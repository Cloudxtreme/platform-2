Cloudwalkers.Views.Settings.Account = Backbone.View.extend({

	'events' : {
		'submit .edit-account' : 'editAccount',
		'click i[data-delete-campaign-id]' : 'deleteCampaign'
	},

	'render' : function ()
	{
		
		var data = Cloudwalkers.Session.getAccount().attributes;
		
		this.$el.html (Mustache.render (Templates.settings.account, data));

		return this;
	},
	
	'editAccount' : function (e)
	{
		var account = Cloudwalkers.Session.getAccount ();
		var name = this.$el.find ('[name=name]').val ();
		
		account.set ('name', name);
		account.save ( function () { Cloudwalkers.RootView.growl('Account settings', "Your account settings are updated"); });
	},
	
	'deleteCampaign' : function (e)
	{
		var account = Cloudwalkers.Session.getAccount();
		var campaign = account.campaigns.get( $(e.target).attr ('data-delete-campaign-id'));
		
		console.log($(e.target).attr ('data-delete-campaign-id'))
		
		campaign.destroy({success: function()
		{
			this.closest('li').remove();
			
		}.bind($(e.target))});
	},

	/* on it's way to be deprecated */
	'negotiateFunctionalities' : function(el) {
		
		// Check collapse option
		this.$el.find('.portlet-title').on('click', function(){ $(this).parents(".collapse-closed, .collapse-open").toggleClass("collapse-closed collapse-open"); });
	}

});