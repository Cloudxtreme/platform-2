Cloudwalkers.Views.Settings.Account = Backbone.View.extend({

	'events' : {
		'click *[data-action]' : 'action',
		'click i[data-delete-campaign-id]' : 'deletecampaign'
	},

	'initialize' : function()
	{
		this.streams = Cloudwalkers.Session.getStreams();
		this.streams = this.streams.filterNetworks();

		this.account = Cloudwalkers.Session.getAccount();
		this.triggers = new Cloudwalkers.Collections.Triggers();

		this.listenTo(this.triggers, 'sync', this.filltriggers);
		
		this.triggermodel = {};
	},

	'render' : function ()
	{		
		var data = Cloudwalkers.Session.getAccount().attributes;

		//Mustache Translate Render
		this.mustacheTranslateRender(data);

		// Apply role permissions to template data
		Cloudwalkers.Session.censuretemplate(data);
	
		this.$el.html (Mustache.render (Templates.settings.account, data));

		this.$el.find("#menu").affix()
	
		// Render manually both trigger's views
		/*this.twitterview = new Cloudwalkers.Views.Settings.Trigger();
		this.dmview = new Cloudwalkers.Views.Settings.Trigger();

		this.$el.find("#triggerlist").append(twitterview.render().el)
		this.$el.find("#triggerlist").append(dmview.render().el)*/

		this.triggers.parent = this.account;
		this.triggers.fetch();

		return this;
	},

	'filltriggers' : function(models)
	{
		//Hack time!
		var twitterfollow = models.filter(function(el){ if(el.get("event") == 'CONTACT-NEW') return el;})
		var dmout = models.filter(function(el){ if(el.get("event") == 'MESSAGE-RECEIVED') return el;})

		if(twitterfollow.length){
			twitterfollow = new Cloudwalkers.Models.Trigger(twitterfollow[0].attributes);
			this.$el.find("#twitterfollow").val(twitterfollow.getmessage());
		}else{
			this.$el.find("#twitterfollow").val("");
		}

		if(dmout.length){
			dmout = new Cloudwalkers.Models.Trigger(dmout[0].attributes);
			this.$el.find("#dmout").val(dmout.getmessage());
		}else{
			this.$el.find("#dmout").val("");
		}

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

	'resettwitterfollow' : function()
	{
		this.$el.find('#twitterfollow').val("");
	},

	'savedmout' : function (e)
	{
		this.triggermodel.event = "MESSAGE-RECEIVED";
		this.triggermodel.actions = [{action: "REPLY", message: this.$el.find('#dmout').val()}]

		var trigger = new Cloudwalkers.Models.Trigger(this.triggermodel);
		trigger.parent = this.account;

		trigger.save();
	},

	'resetdmout' : function()
	{
		this.$el.find('#dmout').val("");
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