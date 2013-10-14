Cloudwalkers.Views.Settings.Container = Backbone.View.extend({

	'events' : {

	},

	'action' : null,

	'setAction' : function (action)
	{
		this.action = action;
	},

	'render' : function ()
	{
		var self = this;

		self.$el.html (Templates.settings.container);

		var view;
		if (this.action == 'profile')
		{
			view = new Cloudwalkers.Views.Settings.Profile ();
		}

		else if (this.action == 'users')
		{
			view = new Cloudwalkers.Views.Settings.Users ();
		}

		else if (this.action == 'services')
		{
			view = new Cloudwalkers.Views.Settings.Services ();
		}

		else if (this.action == 'account')
		{
			view = new Cloudwalkers.Views.Settings.Users ();
		}

		else
		{
			view = new Cloudwalkers.Views.Settings.Users ();
			this.action = 'profile';
		}

		// Set correct tab
		this.$el.find ('.nav-tabs li').removeClass ('active');
		this.$el.find ('.nav-tabs li a[href="#settings/'+this.action+'"]').parent ().addClass ('active');

		// Set the view
		this.$el.find ('.tab-content').html (view.render ().el);
		
		return this;
	}
});