Cloudwalkers.Views.Resync = Backbone.View.extend({

	'className' : 'container-loading',

	'initialize' : function(options)
	{	
		$.extend(this, options);
		
		//Cloudwalkers.Session.user = new Cloudwalkers.Models.Me();
		this.listenTo(Cloudwalkers.Session.user, 'sync', this.activate);
		this.listenTo(Cloudwalkers.Session.user, 'activated', this.refresh)
	},	

	'render' : function ()
	{	
		this.$el.html('<i class="icon-cloud-download"></i>');

		Store.remove('me');
		
		Cloudwalkers.Session.user.fetch();

		return this;
	},

	'activate' : function(data)
	{	
		Cloudwalkers.Session.user.activate(data);
	},

	'refresh' : function()
	{	
		Cloudwalkers.Router.Instance.navigate (this.returnto, true);
	}

});