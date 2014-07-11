Cloudwalkers.Views.Settings.Trigger = Backbone.View.extend({

	'events' : {
		'click *[data-action]' : 'action',
		'click i[data-delete-campaign-id]' : 'deletecampaign'
	},
	
	'initialize' : function(options)
	{
		
	},

	'render' : function()
	{	
		var params = {};
console.log("msg")
		this.$el.html(Mustache.render(Templates.settings.trigger, params))
		
		return this;
	}
});

	