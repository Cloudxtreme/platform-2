Cloudwalkers.Views.Resync = Backbone.View.extend({

	'className' : 'container-loading',

	'initialize' : function(options)
	{	
		$.extend(this, options);
		
		//Cloudwalkers.Session.user = new Cloudwalkers.Models.Me();
		this.listenTo(Cloudwalkers.Session.user, 'sync', this.activate);
		this.listenToOnce(Cloudwalkers.Session.user, 'activated', this.refresh)
	},	

	'render' : function ()
	{	
		this.$el.html('<i class="icon-cloud-download"></i>');

		if(this.gofetch){
			if(Cloudwalkers.Session.resynced)
				return Cloudwalkers.RootView.oops();

			Store.remove('me');
			
			Cloudwalkers.Session.user.fetch();
		}

		return this;
	},

	'activate' : function(data)
	{	
		Cloudwalkers.Session.user.activate(data);
	},

	'refresh' : function()
	{	
		Cloudwalkers.Session.resynced = true;
		Cloudwalkers.Router.Instance.navigate (this.returnto, true);
	}

});