Cloudwalkers.Views.Settings.Account = Backbone.View.extend({

	'events' : {
		'submit .edit-account' : 'editAccount'
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
		
		console.log("ready to save")
		
		account.set ('name', name);
		account.save ( function () { Cloudwalkers.RootView.growl('Account settings', "Your account settings are updated"); });
	},
	
	'negotiateFunctionalities' : function(el) {
		
		// Check collapse option
		this.$el.find('.portlet-title').on('click', function(){ $(this).parents(".collapse-closed, .collapse-open").toggleClass("collapse-closed collapse-open"); });
	}

});